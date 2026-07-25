"use server";

import { z } from "zod";
import { customAlphabet } from "nanoid";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";
import { prisma } from "@/lib/prisma";
import {
  redis,
  createLinkRatelimit,
  checkRateLimit,
  getClientIp,
  LINK_CACHE_PREFIX,
  LINK_CACHE_TTL_SECONDS,
  CachedLink,
} from "@/lib/redis";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 7);

/**
 * KNOWN TRADEOFF (The "Scunthorpe problem"):
 * Pattern/wordlist filters can produce false positives on innocuous words containing flagged substrings.
 * We use `obscenity` with character-substitution/leetspeak detection as a balanced default.
 */
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

function generateCleanSlug(): string {
  for (let i = 0; i < 5; i++) {
    const candidate = nanoid();
    if (!matcher.hasMatch(candidate)) return candidate;
  }
  throw new Error("failed to generate a clean slug after 5 attempts");
}

const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .transform((url) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    })
    .pipe(z.string().url("Please enter a valid URL")),
  customSlug: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores.")
    .min(3, "Slug must be at least 3 characters.")
    .max(30, "Slug cannot exceed 30 characters.")
    .refine((slug) => !matcher.hasMatch(slug), {
      message: "That slug isn't allowed. Please choose a different one.",
    })
    .optional(),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => !val || new Date(val) > new Date(), {
      message: "Expiration date must be in the future.",
    }),
});

async function checkUrlSafety(url: string): Promise<{ flagged: boolean; reason?: string }> {
  // 1. URLhaus (abuse.ch) keyless check — 100% free, zero card, zero signup threat feed
  try {
    const urlhausRes = await fetch("https://urlhaus-api.abuse.ch/v1/url/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }).toString(),
    });

    if (urlhausRes.ok) {
      const urlhausData = await urlhausRes.json();
      if (urlhausData.query_status === "ok") {
        const threatType = urlhausData.threat || "MALWARE_DISTRIBUTION";
        return { flagged: true, reason: threatType.toUpperCase() };
      }
    }
  } catch (err) {
    console.warn("[URLhaus Check Error]:", err);
  }

  // 2. Google Safe Browsing check (optional fallback if SAFE_BROWSING_API_KEY is present)
  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: { clientId: "redir", clientVersion: "1.0.0" },
            threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url }],
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          return { flagged: true, reason: data.matches[0].threatType };
        }
      }
    } catch (err) {
      console.warn("[Safe Browsing Check Error]:", err);
    }
  }

  return { flagged: false };
}

export async function createLink(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "not authenticated" };
  }

  const ip = await getClientIp();
  const { success } = await checkRateLimit(createLinkRatelimit, session.user.email ?? ip);
  if (!success) {
    return { error: "Too many links created. Please try again in a minute." };
  }

  const parsed = createLinkSchema.safeParse({
    originalUrl: formData.get("originalUrl"),
    customSlug: formData.get("customSlug") || undefined,
    expiresAt: formData.get("expiresAt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  let slug: string;
  try {
    slug = parsed.data.customSlug ?? generateCleanSlug();
  } catch (err) {
    return { error: "Unable to generate a clean link slug. Please try again." };
  }

  const existing = await prisma.link.findUnique({ where: { slug } });
  if (existing) {
    return { error: "that slug is already taken" };
  }

  // userId comes from the session, resolved server-side — never trust a client-supplied id
  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) {
    return { error: "user not found" };
  }

  const safety = await checkUrlSafety(parsed.data.originalUrl);

  let newLink: any;
  try {
    newLink = await prisma.link.create({
      data: {
        slug,
        originalUrl: parsed.data.originalUrl,
        userId: user.id,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        flaggedUnsafe: safety.flagged,
        flagReason: safety.reason ?? null,
        flagCheckedAt: new Date(),
      } as any,
    });
  } catch (err: any) {
    if (err?.message?.includes("flaggedUnsafe")) {
      newLink = await prisma.link.create({
        data: {
          slug,
          originalUrl: parsed.data.originalUrl,
          userId: user.id,
          expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        },
      });
    } else {
      throw err;
    }
  }

  // Pre-populate Redis cache for zero-latency redirects
  if (redis) {
    const cachePayload: CachedLink = {
      id: newLink.id,
      originalUrl: newLink.originalUrl,
      expiresAt: newLink.expiresAt ? newLink.expiresAt.toISOString() : null,
      flaggedUnsafe: safety.flagged,
      flagReason: safety.reason ?? null,
    };
    redis
      .set(`${LINK_CACHE_PREFIX}${slug}`, JSON.stringify(cachePayload), {
        ex: LINK_CACHE_TTL_SECONDS,
      })
      .catch((err) => console.warn("[Redis Cache Create Error]:", err));
  }

  revalidatePath("/dashboard");
  return {
    success: true,
    slug,
    flaggedUnsafe: safety.flagged,
    flagReason: safety.reason,
  };
}

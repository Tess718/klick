import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";
import { waitUntil } from "@vercel/functions";
import {
  redis,
  LINK_CACHE_PREFIX,
  LINK_CACHE_TTL_SECONDS,
  CachedLink,
  redirectRatelimit,
  checkRateLimit,
} from "@/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Rate limiting check
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { success } = await checkRateLimit(redirectRatelimit, ip);
  if (!success) {
    return new NextResponse("Too Many Requests. Please slow down.", { status: 429 });
  }

  let linkId: string | null = null;
  let originalUrl: string | null = null;
  let expiresAt: Date | null = null;

  // 2. Redis-first lookup to avoid Postgres DB round-trip latency
  if (redis) {
    try {
      const cached = await redis.get<CachedLink | string>(`${LINK_CACHE_PREFIX}${slug}`);
      if (cached) {
        const parsedData: CachedLink =
          typeof cached === "string" ? JSON.parse(cached) : cached;

        linkId = parsedData.id;
        originalUrl = parsedData.originalUrl;
        expiresAt = parsedData.expiresAt ? new Date(parsedData.expiresAt) : null;
      }
    } catch (err) {
      console.warn("[Redis Cache Miss/Error] Falling back to Prisma DB:", err);
    }
  }

  // 3. Postgres fallback if missing in Redis
  if (!originalUrl || !linkId) {
    const link = await prisma.link.findUnique({
      where: { slug },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    linkId = link.id;
    originalUrl = link.originalUrl;
    expiresAt = link.expiresAt;

    // Cache the resolved link in Redis for 24 hours
    if (redis) {
      const cachePayload: CachedLink = {
        id: link.id,
        originalUrl: link.originalUrl,
        expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
      };
      redis
        .set(`${LINK_CACHE_PREFIX}${slug}`, JSON.stringify(cachePayload), {
          ex: LINK_CACHE_TTL_SECONDS,
        })
        .catch((err) => console.warn("[Redis Cache Set Error]:", err));
    }
  }

  // 4. Expiration check
  if (expiresAt && expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  // 5. Fire-and-forget asynchronous click logging (does NOT delay redirect)
  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";
  const parsed = new UAParser(userAgent).getResult();

  let country = request.headers.get("x-vercel-ip-country") ?? null;
  let city = request.headers.get("x-vercel-ip-city") ?? null;

  if (process.env.NODE_ENV === "development" && !country) {
    country = "US";
    city = "New York";
  }

  // Use waitUntil so click analytics run in the background after redirect response is sent
  waitUntil(
    prisma.click
      .create({
        data: {
          linkId,
          country,
          city,
          device: parsed.device.type ?? "desktop",
          browser: parsed.browser.name ?? null,
          os: parsed.os.name ?? null,
          referrer: referrer || null,
        },
      })
      .catch((err) => {
        console.error("[Click Analytics Error]:", err);
      })
  );

  // 6. Return redirect immediately (sub-10ms response time when cached in Redis)
  return NextResponse.redirect(originalUrl);
}

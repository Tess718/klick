"use server";

import { z } from "zod";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createLinkRatelimit } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 7);

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
    .optional(),
  expiresAt: z.string().optional(),
});

export async function createLink(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "not authenticated" };
  }

  const { success } = await createLinkRatelimit.limit(session.user.email ?? "anonymous");
  if (!success) {
    return { error: "too many links created, try again in a minute" };
  }

  const parsed = createLinkSchema.safeParse({
    originalUrl: formData.get("originalUrl"),
    customSlug: formData.get("customSlug") || undefined,
    expiresAt: formData.get("expiresAt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const slug = parsed.data.customSlug ?? nanoid();

  const existing = await prisma.link.findUnique({ where: { slug } });
  if (existing) {
    return { error: "that slug is already taken" };
  }

  // userId comes from the session, resolved server-side — never trust a client-supplied id
  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) {
    return { error: "user not found" };
  }

  await prisma.link.create({
    data: {
      slug,
      originalUrl: parsed.data.originalUrl,
      userId: user.id,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, slug };
}

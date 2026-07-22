"use server";

import { prisma } from "@/lib/prisma";
import { redis, LINK_CACHE_PREFIX } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteLink(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const link = await prisma.link.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!link) {
    return { error: "Link not found or unauthorized" };
  }

  await prisma.link.delete({
    where: { id },
  });

  await redis?.del(`${LINK_CACHE_PREFIX}${link.slug}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateLink(id: string, data: { originalUrl?: string; expiresAt?: Date | null }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const link = await prisma.link.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!link) {
    return { error: "Link not found or unauthorized" };
  }

  await prisma.link.update({
    where: { id },
    data: {
      originalUrl: data.originalUrl,
      expiresAt: data.expiresAt,
    },
  });

  await redis?.del(`${LINK_CACHE_PREFIX}${link.slug}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/links/${id}`);

  return { success: true };
}

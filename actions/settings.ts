"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signOut, unstable_update } from "@/lib/auth";
import { settingsRatelimit, checkRateLimit, getClientIp } from "@/lib/redis";
import { revalidatePath } from "next/cache";

const emailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address."),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
  confirmPassword: z.string(),
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to confirm account deletion."),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const ip = await getClientIp();
  const { success } = await checkRateLimit(settingsRatelimit, session.user.id ?? ip);
  if (!success) {
    return { error: "Too many settings updates. Please try again in a minute." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  await unstable_update({ user: { name: parsed.data.name } });

  revalidatePath("/dashboard");
  return { success: true, message: "Profile updated successfully." };
}

export async function updateEmail(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const ip = await getClientIp();
  const { success } = await checkRateLimit(settingsRatelimit, session.user.id ?? ip);
  if (!success) {
    return { error: "Too many settings updates. Please try again in a minute." };
  }

  const parsed = emailSchema.safeParse({
    newEmail: formData.get("newEmail"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Check if email is already in use
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.newEmail },
  });
  if (existing) {
    return { error: "That email is already in use." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { email: parsed.data.newEmail },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Email updated successfully." };
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const ip = await getClientIp();
  const { success } = await checkRateLimit(settingsRatelimit, session.user.id ?? ip);
  if (!success) {
    return { error: "Too many settings updates. Please try again in a minute." };
  }

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  if (parsed.data.newPassword !== parsed.data.confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found." };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true, message: "Password updated successfully." };
}

export async function deleteAccount(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const ip = await getClientIp();
  const { success } = await checkRateLimit(settingsRatelimit, session.user.id ?? ip);
  if (!success) {
    return { error: "Too many attempts. Please try again in a minute." };
  }

  const parsed = deleteAccountSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    return { error: "User not found or password unavailable." };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.password);
  if (!valid) {
    return { error: "Incorrect password. Account deletion canceled." };
  }

  // Cascade delete handles user's links and click data
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  await signOut({ redirectTo: "/" });
}

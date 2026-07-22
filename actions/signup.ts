"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { signupRatelimit, checkRateLimit, getClientIp } from "@/lib/redis";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
});

export async function signup(formData: FormData) {
  const ip = await getClientIp();
  const { success } = await checkRateLimit(signupRatelimit, ip);
  if (!success) {
    return { error: "Too many signup attempts. Please try again in a minute." };
  }

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    // Return the specific Zod error message
    return { error: parsed.error.errors[0].message };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Unable to create your account" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, password: hashed },
  });

  // Automatically log the user in after creation
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created successfully, but automatic login failed. Please log in." };
    }
    // Auth.js throws a redirect internally on success - rethrow so it works
    throw err;
  }
}

"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { loginRatelimit, checkRateLimit, getClientIp } from "@/lib/redis";

export async function login(formData: FormData) {
  const ip = await getClientIp();
  const { success } = await checkRateLimit(loginRatelimit, ip);
  if (!success) {
    return { error: "Too many login attempts. Please try again in a minute." };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "invalid email or password" };
    }
    // Auth.js throws a redirect internally on success - rethrow so it works
    throw err;
  }
}

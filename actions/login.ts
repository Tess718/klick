"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
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

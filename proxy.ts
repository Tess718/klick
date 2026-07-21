import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup";
  const isLandingRoute = req.nextUrl.pathname === "/";

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if ((isAuthRoute || isLandingRoute) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  
  return NextResponse.next();
});

export const config = {
  // Matches all routes except next internals, static files, and api routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

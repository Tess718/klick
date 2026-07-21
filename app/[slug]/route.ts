import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const expired = link.expiresAt ? link.expiresAt < new Date() : false;
  if (expired) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  // Parse user agent for analytics
  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";
  const parsed = new UAParser(userAgent).getResult();

  // Vercel injects geo headers automatically in production
  let country = request.headers.get("x-vercel-ip-country") ?? null;
  let city = request.headers.get("x-vercel-ip-city") ?? null;

  // Development fallback so local clicks render on the map on localhost
  if (process.env.NODE_ENV === "development" && !country) {
    country = "US";
    city = "New York";
  }

  // Log the click reliably before redirecting
  try {
    await prisma.click.create({
      data: {
        linkId: link.id,
        country,
        city,
        device: parsed.device.type ?? "desktop",
        browser: parsed.browser.name ?? null,
        os: parsed.os.name ?? null,
        referrer: referrer || null,
      },
    });
  } catch (err) {
    // Click logging failures should never break the redirect
  }

  return NextResponse.redirect(link.originalUrl);
}

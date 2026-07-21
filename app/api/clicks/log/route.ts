import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { linkId, country, city, userAgent, referrer } = body as {
    linkId: string;
    country: string | null;
    city: string | null;
    userAgent: string;
    referrer: string;
  };

  if (!linkId) {
    return NextResponse.json({ error: "missing linkId" }, { status: 400 });
  }

  const parsed = new UAParser(userAgent).getResult();

  await prisma.click.create({
    data: {
      linkId,
      country,
      city,
      device: parsed.device.type ?? "desktop",
      browser: parsed.browser.name ?? null,
      os: parsed.os.name ?? null,
      referrer: referrer || null,
    },
  });

  return NextResponse.json({ ok: true });
}

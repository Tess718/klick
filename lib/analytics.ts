import { prisma } from "@/lib/prisma";

// Cache Components (Next.js 16): explicit, opt-in caching for the analytics
// read path. Short TTL since click data updates frequently, but the dashboard
// doesn't need per-request freshness on every chart re-render.
export async function getLinkAnalytics(linkId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalClicks, clicksToday, deviceBreakdown, countryBreakdown, clicksByDay] = await Promise.all([
    prisma.click.count({ where: { linkId } }),
    prisma.click.count({
      where: {
        linkId,
        timestamp: { gte: today },
      },
    }),
    prisma.click.groupBy({
      by: ["device"],
      where: { linkId },
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: { linkId },
      _count: true,
    }),
    prisma.$queryRaw`
      SELECT DATE(timestamp) as day, COUNT(*) as count
      FROM "Click"
      WHERE "linkId" = ${linkId}
      GROUP BY DATE(timestamp)
      ORDER BY day ASC
    `,
  ]);

  return { totalClicks, clicksToday, deviceBreakdown, countryBreakdown, clicksByDay };
}

export async function getGlobalAnalytics(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalClicks,
    clicksToday,
    uniqueCountries,
    totalLinks,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    countryBreakdown,
    referrerBreakdown,
    clicksByDay,
  ] = await Promise.all([
    prisma.click.count({ where: { link: { userId } } }),
    prisma.click.count({
      where: {
        link: { userId },
        timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: { link: { userId }, country: { not: null } },
    }),
    prisma.link.count({ where: { userId } }),
    prisma.click.groupBy({
      by: ["device"],
      where: { link: { userId } },
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["browser"],
      where: { link: { userId } },
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["os"],
      where: { link: { userId } },
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: { link: { userId } },
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["referrer"],
      where: { link: { userId }, referrer: { not: null } },
      _count: true,
    }),
    prisma.$queryRaw`
      SELECT DATE(timestamp) as day, COUNT(*) as count
      FROM "Click"
      WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId})
        AND timestamp >= ${thirtyDaysAgo}
      GROUP BY DATE(timestamp)
      ORDER BY day ASC
    `,
  ]);

  return {
    totalClicks,
    clicksToday,
    uniqueCountries: uniqueCountries.length,
    totalLinks,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    countryBreakdown,
    referrerBreakdown,
    clicksByDay,
  };
}

import { prisma } from "@/lib/prisma";

// Cache Components (Next.js 16): explicit, opt-in caching for the analytics
// read path. Short TTL since click data updates frequently, but the dashboard
// doesn't need per-request freshness on every chart re-render.
export async function getLinkAnalytics(linkId: string, range: string = "7d") {
  let startDate: Date | undefined;
  const now = new Date();

  if (range === "24h") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (range === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (range === "90d") {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (range === "all") {
    startDate = undefined;
  } else {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const timeFilter = startDate ? { timestamp: { gte: startDate } } : {};
  const clickWhere = { linkId, ...timeFilter };

  const [totalClicks, clicksToday, deviceBreakdown, countryBreakdown, clicksByDay] = await Promise.all([
    prisma.click.count({ where: clickWhere }),
    prisma.click.count({
      where: {
        linkId,
        timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.click.groupBy({
      by: ["device"],
      where: clickWhere,
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: clickWhere,
      _count: true,
    }),
    startDate
      ? prisma.$queryRaw`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM "Click"
          WHERE "linkId" = ${linkId}
            AND timestamp >= ${startDate}
          GROUP BY DATE(timestamp)
          ORDER BY day ASC
        `
      : prisma.$queryRaw`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM "Click"
          WHERE "linkId" = ${linkId}
          GROUP BY DATE(timestamp)
          ORDER BY day ASC
        `,
  ]);

  return { totalClicks, clicksToday, deviceBreakdown, countryBreakdown, clicksByDay };
}

export async function getGlobalAnalytics(userId: string, range: string = "7d") {
  let startDate: Date | undefined;
  const now = new Date();

  if (range === "24h") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (range === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (range === "90d") {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (range === "all") {
    startDate = undefined;
  } else {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const timeFilter = startDate ? { timestamp: { gte: startDate } } : {};
  const clickWhere = { link: { userId }, ...timeFilter };

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
    prisma.click.count({ where: clickWhere }),
    prisma.click.count({
      where: {
        link: { userId },
        timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: { ...clickWhere, country: { not: null } },
    }),
    prisma.link.count({ where: { userId } }),
    prisma.click.groupBy({
      by: ["device"],
      where: clickWhere,
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["browser"],
      where: clickWhere,
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["os"],
      where: clickWhere,
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["country"],
      where: clickWhere,
      _count: true,
    }),
    prisma.click.groupBy({
      by: ["referrer"],
      where: { ...clickWhere, referrer: { not: null } },
      _count: true,
    }),
    startDate
      ? prisma.$queryRaw`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM "Click"
          WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId})
            AND timestamp >= ${startDate}
          GROUP BY DATE(timestamp)
          ORDER BY day ASC
        `
      : prisma.$queryRaw`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM "Click"
          WHERE "linkId" IN (SELECT id FROM "Link" WHERE "userId" = ${userId})
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

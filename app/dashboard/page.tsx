import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "./copy-button";
import { DashboardSearch } from "./search";
import { DeleteLinkButton } from "./delete-link-button";
import { AutoRefresh } from "./auto-refresh";
import { RefreshButton } from "./refresh-button";
import { ArrowTopRightOnSquareIcon, ChartBarIcon, LinkIcon, CursorArrowRaysIcon, CalendarDaysIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const userId = session.user.id;

  // Fetch stats
  const totalClicks = await prisma.click.count({
    where: { link: { userId } },
  });

  const activeLinks = await prisma.link.count({
    where: {
      userId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  const topCountryData = await prisma.click.groupBy({
    by: ["country"],
    where: { link: { userId }, country: { not: null } },
    _count: true,
    orderBy: {
      _count: {
        country: "desc"
      },
    },
    take: 1,
  });
  const topCountry = topCountryData.length > 0 ? topCountryData[0].country : "N/A";

  // Clicks today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const clicksToday = await prisma.click.count({
    where: {
      link: { userId },
      timestamp: { gte: today },
    },
  });

  // Average clicks per link
  const totalLinks = await prisma.link.count({ where: { userId } });
  const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  // Links List
  const links = await prisma.link.findMany({
    where: {
      userId,
      ...(q
        ? {
            OR: [
              { slug: { contains: q, mode: "insensitive" } },
              { originalUrl: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      _count: {
        select: { clicks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <AutoRefresh />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="flex items-center gap-3">
          <RefreshButton />
          <Link
            href="/dashboard/new"
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Create Link
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Card */}
        <div className="md:col-span-1 bg-zinc-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 font-medium mb-2">
              <CursorArrowRaysIcon className="w-5 h-5" />
              Total Clicks
            </div>
            <div className="text-5xl font-bold tracking-tighter mt-4">{totalClicks.toLocaleString()}</div>
          </div>
          <div className="text-sm text-zinc-400 mt-6">Across all your links</div>
        </div>

        {/* Secondary Stats */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
              <LinkIcon className="w-5 h-5" /> Active Links
            </div>
            <div className="text-3xl font-bold">{activeLinks.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
              <GlobeAltIcon className="w-5 h-5" /> Top Country
            </div>
            <div className="text-3xl font-bold">{topCountry}</div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
              <CalendarDaysIcon className="w-5 h-5" /> Avg Clicks / Link
            </div>
            <div className="text-3xl font-bold">{avgClicksPerLink.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
              <CursorArrowRaysIcon className="w-5 h-5" /> Clicks Today
            </div>
            <div className="text-3xl font-bold">{clicksToday.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold tracking-tight">Your Links</h2>
          <DashboardSearch />
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Short Link</th>
                  <th className="px-6 py-4 font-medium">Original URL</th>
                  <th className="px-6 py-4 font-medium">Clicks</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No links found. {q ? "Try a different search term." : "Create your first short link above."}
                    </td>
                  </tr>
                ) : (
                  links.map((link: any) => {
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "localhost:3000";
                    const shortUrl = `${baseUrl}/${link.slug}`;
                    return (
                      <tr key={link.id} className="hover:bg-zinc-50:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-900">{link.slug}</span>
                            <CopyButton text={shortUrl} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[300px]">
                            <span className="truncate">{link.originalUrl}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-600">
                          {link._count.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/dashboard/links/${link.id}`}
                            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-900:text-zinc-100 hover:bg-zinc-100:bg-zinc-800 rounded-md transition-colors"
                            title="View analytics"
                          >
                            <ChartBarIcon className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/links/${link.id}/edit`}
                            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50:bg-blue-950/30 rounded-md transition-colors"
                            title="Edit link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </Link>
                          <DeleteLinkButton id={link.id} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

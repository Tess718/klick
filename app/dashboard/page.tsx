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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Greeting } from "./greeting";

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
  let topCountry = topCountryData.length > 0 && topCountryData[0].country ? topCountryData[0].country : "N/A";
  if (topCountry !== "N/A") {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      topCountry = regionNames.of(topCountry) || topCountry;
    } catch (e) {
      // Fallback to the raw code if Intl fails
    }
  }

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
      <Greeting name={session.user.name ?? null} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Card */}
        <Card className="md:col-span-1 bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary-foreground/80">
              <CursorArrowRaysIcon className="w-5 h-5" /> Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter mt-2">{totalClicks.toLocaleString()}</div>
            <div className="text-sm text-primary-foreground/60 mt-4">Across all your links</div>
          </CardContent>
        </Card>

        {/* Secondary Stats */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <LinkIcon className="w-5 h-5" /> Active Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLinks.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <GlobeAltIcon className="w-5 h-5" /> Top Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCountry}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <CalendarDaysIcon className="w-5 h-5" /> Avg Clicks / Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgClicksPerLink.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <CursorArrowRaysIcon className="w-5 h-5" /> Clicks Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clicksToday.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Links List */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold tracking-tight">Your Links</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <DashboardSearch />
            <RefreshButton />
            <Button render={<Link href="/dashboard/new" />}>
              Create Link
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Short Link</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No links found. {q ? "Try a different search term." : "Create your first short link above."}
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link: any) => {
                  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "localhost:3000";
                  const shortUrl = `${baseUrl}/${link.slug}`;
                  return (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{link.slug}</span>
                          <CopyButton text={shortUrl} />
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="max-w-[200px] sm:max-w-[300px] truncate">
                          {link.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell>{link._count.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <Button variant="ghost" size="icon" render={<Link href={`/dashboard/links/${link.id}`} />}>
                            <ChartBarIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" render={<Link href={`/dashboard/links/${link.id}/edit`} />}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </Button>
                          <DeleteLinkButton id={link.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

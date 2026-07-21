import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getLinkAnalytics } from "@/lib/analytics";
import { ClicksOverTimeChart, DeviceBreakdownChart } from "./charts";
import { ArrowLeftIcon, CalendarIcon, LinkIcon, ArrowTopRightOnSquareIcon, CursorArrowRaysIcon, GlobeAltIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { CopyButton } from "../../copy-button";
import { QRCodeDisplay } from "./qr-code";
import { WorldMapChart } from "./map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function LinkAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const link = await prisma.link.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!link) {
    notFound();
  }

  const analytics = await getLinkAnalytics(id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "localhost:3000";
  const shortUrl = `${baseUrl}/${link.slug}`;

  return (
    <div className="max-w-6xl mx-auto w-full pb-10">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{link.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Info */}
      <Card className="mb-8 bg-primary text-primary-foreground border-none shadow-md overflow-visible">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex-1 min-w-0">
            <div className="flex md:flex-row flex-col items-center gap-3 mb-2">
              <h2 className="text-xl font-bold truncate">{link.slug}</h2>
              <div className="flex items-center gap-1">
                <span className="text-primary-foreground/80 font-medium px-2 py-0.5 bg-primary-foreground/10 rounded-md text-sm">
                  {shortUrl}
                </span>
                <CopyButton text={shortUrl} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-4">
              <LinkIcon className="w-4 h-4" />
              <a href={link.originalUrl} target="_blank" rel="noreferrer" className="truncate hover:underline max-w-[300px] sm:max-w-md">
                {link.originalUrl}
              </a>
              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-primary-foreground/60">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" /> Created {new Date(link.createdAt).toLocaleDateString()}
              </div>
              {link.expiresAt && (
                <div className="flex items-center gap-1 text-red-400">
                  <CalendarIcon className="w-4 h-4" /> Expires {new Date(link.expiresAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <QRCodeDisplay url={`https://${shortUrl}`} />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <CursorArrowRaysIcon className="w-5 h-5" /> Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="w-5 h-5" /> Clicks Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clicksToday.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <GlobeAltIcon className="w-5 h-5" /> Countries Reached
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.countryBreakdown.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ComputerDesktopIcon className="w-5 h-5" /> Top Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {analytics.deviceBreakdown.length > 0 ? analytics.deviceBreakdown[0].device : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <ClicksOverTimeChart data={analytics.clicksByDay as any} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <DeviceBreakdownChart data={analytics.deviceBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Reach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <WorldMapChart data={analytics.countryBreakdown} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

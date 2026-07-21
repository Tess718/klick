import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGlobalAnalytics } from "@/lib/analytics";
import { GlobalClicksChart, BreakdownChart } from "./charts";
import { CursorArrowRaysIcon, GlobeAltIcon, LinkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const analytics = await getGlobalAnalytics(session.user.id);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CalendarDaysIcon className="w-5 h-5" /> Clicks Today
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
            <div className="text-2xl font-bold">{analytics.uniqueCountries.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="w-5 h-5" /> Total Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLinks.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clicks Over Time */}
      <Card>
        <CardContent className="pt-6">
          <GlobalClicksChart data={analytics.clicksByDay as any} />
        </CardContent>
      </Card>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <BreakdownChart data={analytics.countryBreakdown as any} dataKey="country" title="Top Countries" color="#10b981" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <BreakdownChart data={analytics.referrerBreakdown as any} dataKey="referrer" title="Top Referrers" color="#f59e0b" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <BreakdownChart data={analytics.deviceBreakdown as any} dataKey="device" title="Devices" color="#3b82f6" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <BreakdownChart data={analytics.browserBreakdown as any} dataKey="browser" title="Browsers" color="#8b5cf6" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <BreakdownChart data={analytics.osBreakdown as any} dataKey="os" title="Operating Systems" color="#ef4444" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

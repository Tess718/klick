import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGlobalAnalytics } from "@/lib/analytics";
import { GlobalClicksChart, BreakdownChart } from "./charts";
import { CursorArrowRaysIcon, GlobeAltIcon, LinkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const analytics = await getGlobalAnalytics(session.user.id);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
            <CursorArrowRaysIcon className="w-5 h-5" /> Total Clicks
          </div>
          <div className="text-3xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
            <CalendarDaysIcon className="w-5 h-5" /> Clicks Today
          </div>
          <div className="text-3xl font-bold">{analytics.clicksToday.toLocaleString()}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
            <GlobeAltIcon className="w-5 h-5" /> Countries Reached
          </div>
          <div className="text-3xl font-bold">{analytics.uniqueCountries.toLocaleString()}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 font-medium mb-2">
            <LinkIcon className="w-5 h-5" /> Total Links
          </div>
          <div className="text-3xl font-bold">{analytics.totalLinks.toLocaleString()}</div>
        </div>
      </div>

      {/* Clicks Over Time */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
        <GlobalClicksChart data={analytics.clicksByDay as any} />
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
          <BreakdownChart data={analytics.countryBreakdown as any} dataKey="country" title="Top Countries" color="#10b981" />
        </div>
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
          <BreakdownChart data={analytics.referrerBreakdown as any} dataKey="referrer" title="Top Referrers" color="#f59e0b" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
          <BreakdownChart data={analytics.deviceBreakdown as any} dataKey="device" title="Devices" color="#3b82f6" />
        </div>
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
          <BreakdownChart data={analytics.browserBreakdown as any} dataKey="browser" title="Browsers" color="#8b5cf6" />
        </div>
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
          <BreakdownChart data={analytics.osBreakdown as any} dataKey="os" title="Operating Systems" color="#ef4444" />
        </div>
      </div>
    </div>
  );
}

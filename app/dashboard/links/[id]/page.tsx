import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getLinkAnalytics } from "@/lib/analytics";
import { ClicksOverTimeChart, DeviceBreakdownChart } from "./charts";
import { ArrowLeftIcon, CalendarIcon, LinkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { CopyButton } from "../../copy-button";
import { QRCodeDisplay } from "./qr-code";
import { WorldMapChart } from "./map";

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
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 bg-paper border border-ink/20 rounded-lg hover:bg-ink/5 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-ink" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Link Analytics</h1>
      </div>

      {/* Header Info */}
      <div className="bg-ink rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center text-paper">
        <div className="flex-1 min-w-0">
          <div className="flex md:flex-row flex-col items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-paper truncate">{link.slug}</h2>
            <div className="flex items-center gap-1">
              <span className="text-paper/70 font-medium px-2 py-0.5 bg-paper/10 rounded-md text-sm">
                {shortUrl}
              </span>
              <CopyButton text={shortUrl} />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-paper/70 text-sm mb-4">
            <LinkIcon className="w-4 h-4" />
            <a href={link.originalUrl} target="_blank" rel="noreferrer" className="truncate hover:underline max-w-[300px] sm:max-w-md">
              {link.originalUrl}
            </a>
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-paper/50">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" /> Created {new Date(link.createdAt).toLocaleDateString()}
            </div>
            {link.expiresAt && (
              <div className="flex items-center gap-1 text-amber-500">
                <CalendarIcon className="w-4 h-4" /> Expires {new Date(link.expiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center p-2 bg-paper rounded-xl">
          <QRCodeDisplay url={`https://${shortUrl}`} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-zinc-200 p-5 rounded-2xl">
          <div className="text-sm font-medium text-zinc-500 mb-1">Total Clicks</div>
          <div className="text-3xl font-bold text-zinc-900">{analytics.totalClicks.toLocaleString()}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 rounded-2xl">
          <ClicksOverTimeChart data={analytics.clicksByDay as any} />
        </div>
        <div className="lg:col-span-1 bg-white border border-zinc-200 p-6 rounded-2xl">
          <DeviceBreakdownChart data={analytics.deviceBreakdown} />
        </div>
      </div>

      <div className="bg-paper text-ink border border-ink/10 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold mb-6">Global Reach</h3>
        <div className="h-[400px]">
          <WorldMapChart data={analytics.countryBreakdown} />
        </div>
      </div>
    </div>
  );
}

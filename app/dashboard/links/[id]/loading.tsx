export default function LinkAnalyticsLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full pb-10">
      <div className="mb-6 flex items-center gap-4 animate-pulse">
        <div className="w-10 h-10 bg-zinc-200 rounded-lg"></div>
        <div className="h-8 bg-zinc-200 rounded w-48"></div>
      </div>

      {/* Header Info Skeleton */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center animate-pulse">
        <div className="flex-1 w-full">
          <div className="h-7 bg-zinc-200 rounded w-32 mb-2"></div>
          <div className="h-5 bg-zinc-200 rounded w-64 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-zinc-200 rounded w-32"></div>
            <div className="h-4 bg-zinc-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-48 h-48 bg-zinc-200 rounded-2xl"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-zinc-200 p-5 rounded-2xl h-[92px] animate-pulse"></div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 rounded-2xl h-[320px] animate-pulse"></div>
        <div className="lg:col-span-1 bg-white border border-zinc-200 p-6 rounded-2xl h-[320px] animate-pulse"></div>
      </div>

      <div className="bg-white border border-zinc-200 p-6 rounded-2xl h-[470px] animate-pulse"></div>
    </div>
  );
}

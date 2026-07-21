export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div className="h-9 bg-zinc-200 rounded w-48 animate-pulse"></div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-5 rounded-2xl h-[104px] animate-pulse"></div>
        ))}
      </div>

      {/* Line Chart Skeleton */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl h-[340px] animate-pulse"></div>

      {/* 2-col Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-6 rounded-2xl h-[280px] animate-pulse"></div>
        ))}
      </div>

      {/* 3-col Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-6 rounded-2xl h-[280px] animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

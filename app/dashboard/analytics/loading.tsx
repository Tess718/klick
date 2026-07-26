export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-5 bg-muted/60 rounded w-40 animate-pulse" />
        <div className="h-8 bg-muted/60 rounded-xl w-56 animate-pulse" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-xl h-[92px] flex flex-col justify-between animate-pulse">
            <div className="h-4 bg-muted/60 rounded w-28" />
            <div className="h-7 bg-muted/60 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Line Chart Skeleton */}
      <div className="bg-card border border-border p-6 rounded-xl h-[340px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-muted/60 rounded w-36" />
        <div className="h-[240px] w-full bg-muted/40 rounded-lg" />
      </div>

      {/* 2-col Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl h-[280px] flex flex-col justify-between animate-pulse">
            <div className="h-5 bg-muted/60 rounded w-32" />
            <div className="h-[180px] w-full bg-muted/40 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 3-col Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl h-[280px] flex flex-col justify-between animate-pulse">
            <div className="h-5 bg-muted/60 rounded w-28" />
            <div className="h-[180px] w-full bg-muted/40 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

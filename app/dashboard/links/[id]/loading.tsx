export default function LinkAnalyticsLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full pb-10 flex flex-col gap-6">
      {/* Breadcrumbs Skeleton */}
      <div className="h-5 bg-muted/60 rounded w-44 animate-pulse" />

      {/* Header Info Skeleton (Hero Card) */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-6 justify-between items-start md:items-center animate-pulse">
        <div className="flex-1 w-full space-y-3">
          <div className="h-7 bg-primary-foreground/20 rounded w-36" />
          <div className="h-4 bg-primary-foreground/20 rounded w-64" />
          <div className="flex items-center gap-4 pt-1">
            <div className="h-4 bg-primary-foreground/20 rounded w-32" />
            <div className="h-4 bg-primary-foreground/20 rounded w-28" />
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto flex justify-end">
          <div className="w-28 h-28 bg-primary-foreground/20 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-xl h-[88px] flex flex-col justify-between animate-pulse">
            <div className="h-4 bg-muted/60 rounded w-24" />
            <div className="h-7 bg-muted/60 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl h-[320px] flex flex-col justify-between animate-pulse">
          <div className="h-5 bg-muted/60 rounded w-36" />
          <div className="h-[230px] w-full bg-muted/40 rounded-lg" />
        </div>
        <div className="lg:col-span-1 bg-card border border-border p-6 rounded-xl h-[320px] flex flex-col justify-between animate-pulse">
          <div className="h-5 bg-muted/60 rounded w-28" />
          <div className="h-[230px] w-full bg-muted/40 rounded-lg" />
        </div>
      </div>

      {/* Global Reach Map Card Skeleton */}
      <div className="bg-card border border-border p-6 rounded-xl h-[470px] flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-muted/60 rounded w-32" />
        <div className="h-[380px] w-full bg-muted/40 rounded-lg" />
      </div>
    </div>
  );
}

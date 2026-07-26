export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      {/* Greeting Banner Skeleton */}
      <div className="bg-muted/60 p-8 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse min-h-[116px]">
        <div className="flex-1 space-y-3">
          <div className="h-7 bg-muted-foreground/20 rounded-lg w-64" />
          <div className="h-4 bg-muted-foreground/20 rounded w-72 sm:w-80" />
        </div>
        <div className="hidden sm:block w-16 h-16 rounded-full bg-muted-foreground/20 shrink-0" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Card */}
        <div className="md:col-span-1 bg-card border border-border rounded-xl p-6 flex flex-col justify-between h-[160px] animate-pulse">
          <div>
            <div className="h-4 bg-muted/60 rounded w-28 mb-3" />
            <div className="h-9 bg-muted/60 rounded w-36" />
          </div>
          <div className="h-3 bg-muted/60 rounded w-28" />
        </div>

        {/* 4 Secondary Stat Cards */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border p-5 rounded-xl h-[76px] flex flex-col justify-between animate-pulse">
              <div className="h-4 bg-muted/60 rounded w-24" />
              <div className="h-6 bg-muted/60 rounded w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Links List Skeleton */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div className="h-7 bg-muted/60 rounded-lg w-28 animate-pulse" />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-9 bg-muted/60 rounded-lg w-full sm:w-64 animate-pulse" />
            <div className="h-9 w-9 bg-muted/60 rounded-lg shrink-0 animate-pulse" />
            <div className="h-9 w-28 bg-muted/60 rounded-lg shrink-0 animate-pulse" />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="h-10 bg-muted/30 border-b border-border px-4 flex items-center justify-between">
            <div className="h-4 bg-muted/60 rounded w-24 animate-pulse" />
            <div className="h-4 bg-muted/60 rounded w-32 hidden sm:block animate-pulse" />
            <div className="h-4 bg-muted/60 rounded w-12 animate-pulse" />
            <div className="h-4 bg-muted/60 rounded w-16 hidden md:block animate-pulse" />
            <div className="h-4 bg-muted/60 rounded w-16 animate-pulse" />
          </div>

          <div className="divide-y divide-border/50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-muted/60 rounded w-28" />
                  <div className="h-5 w-5 bg-muted/60 rounded" />
                </div>
                <div className="h-4 bg-muted/60 rounded w-48 hidden sm:block" />
                <div className="h-4 bg-muted/60 rounded w-8" />
                <div className="h-4 bg-muted/60 rounded w-20 hidden md:block" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-muted/60 rounded-lg" />
                  <div className="h-8 w-8 bg-muted/60 rounded-lg" />
                  <div className="h-8 w-8 bg-muted/60 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

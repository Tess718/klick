export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded w-48"></div>
        <div className="h-10 bg-zinc-200 rounded-lg w-32"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="mb-10">
        <div className="h-6 bg-zinc-200 rounded w-24 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white h-28 rounded-2xl border border-zinc-200 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Links List Skeleton */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 animate-pulse">
          <div className="h-6 bg-zinc-200 rounded w-32"></div>
          <div className="h-10 bg-zinc-200 rounded-lg w-full sm:w-64"></div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-zinc-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 sm:p-6 flex items-center justify-between animate-pulse">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-5 bg-zinc-200 rounded w-32"></div>
                  </div>
                  <div className="h-4 bg-zinc-200 rounded w-64"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <div className="h-4 bg-zinc-200 rounded w-20"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-zinc-200 rounded-md"></div>
                    <div className="h-9 w-9 bg-zinc-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

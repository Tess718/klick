export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full pb-10">
      <div className="h-9 bg-zinc-200 rounded w-32 animate-pulse"></div>

      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 animate-pulse">
              <div className="w-10 h-10 bg-zinc-200 rounded-lg"></div>
              <div>
                <div className="h-5 bg-zinc-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-48"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-11 bg-zinc-200 rounded-lg w-full"></div>
              {i === 1 && (
                <>
                  <div className="h-11 bg-zinc-200 rounded-lg w-full"></div>
                  <div className="h-11 bg-zinc-200 rounded-lg w-full"></div>
                </>
              )}
              <div className="h-10 bg-zinc-200 rounded-lg w-32 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

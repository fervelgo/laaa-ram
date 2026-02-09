export default function ObjectLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header skeleton */}
      <header className="border-b border-neutral-100">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />
          <div className="h-6 w-12 bg-neutral-100 rounded animate-pulse" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse mb-2" />
          <div className="h-10 w-64 bg-neutral-100 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse mb-1" />
                <div className="h-5 w-24 bg-neutral-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Viewer skeleton */}
        <div className="aspect-[4/3] bg-neutral-100 rounded-lg animate-pulse mb-8" />
      </div>
    </main>
  );
}

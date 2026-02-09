export default function Loading() {
  const skeletonRows = Array.from({ length: 5 });
  const skeletonItems = Array.from({ length: 8 });

  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
        {skeletonRows.map((_, rowIndex) => (
          <div key={rowIndex} className="relative mb-2">
            <div className="flex justify-between items-end gap-2 md:gap-4 pb-2">
              {skeletonItems.map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex-1 aspect-square bg-neutral-100 animate-pulse rounded"
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200" />
          </div>
        ))}
      </div>
    </main>
  );
}

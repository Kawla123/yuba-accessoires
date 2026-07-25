export default function Loading() {
  return (
    <main className="flex-1">
      <div className="h-[75vh] min-h-[480px] animate-pulse bg-cream-2" />
      <div className="border-b border-border px-6 py-5 sm:px-10 lg:px-16">
        <div className="h-4 w-24 animate-pulse bg-cream-2" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-16">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] w-full animate-pulse bg-cream-2" />
            <div className="mt-3 h-4 w-3/4 animate-pulse bg-cream-2" />
            <div className="mt-2 h-3 w-1/2 animate-pulse bg-cream-2" />
          </div>
        ))}
      </div>
    </main>
  );
}

type SkeletonCardProps = {
  count?: number; // چند تا کارت اسکلت؟ پیش‌فرض 8
};

export default function SkeletonCard({ count = 8 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto pb-12">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow p-4 animate-pulse bg-white dark:bg-gray-800"
        >
          <div className="h-48 w-full rounded mb-3 bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-2/3 rounded mb-2 bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded mb-4 bg-gray-200 dark:bg-gray-700" />
          <div className="h-9 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

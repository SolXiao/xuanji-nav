'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-lg ${className}`}
    />
  );
}

export function NavigationCardSkeleton() {
  return (
    <div className="relative group p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden h-32 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-16 h-4 rounded-full" />
        <Skeleton className="w-12 h-3" />
      </div>
    </div>
  );
}

export function CategorySectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 ml-2">
        <Skeleton className="w-6 h-6 rounded-lg" />
        <Skeleton className="w-32 h-7" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <NavigationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

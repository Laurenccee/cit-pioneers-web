import { Skeleton } from '../ui/skeleton';

export default function NavigationLoading() {
  return (
    <header className="sticky top-0 bg-card z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-md" />
          <Skeleton className="h-6 w-28" />
        </div>

        {/* Nav links */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 mx-4" />
          <Skeleton className="h-5 w-12 mx-4" />
          <Skeleton className="h-5 w-16 mx-4" />
          <Skeleton className="h-5 w-14 mx-4" />
          <Skeleton className="h-5 w-12 mx-4" />
        </div>

        {/* User info + button */}
        <div className="flex items-center gap-4">
          <Skeleton className="hidden sm:block h-5 w-24" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </header>
  );
}

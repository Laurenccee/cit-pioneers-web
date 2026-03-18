import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Nav skeleton */}

      <main className="container mx-auto space-y-8 px-6 py-8">
        {/* Welcome banner skeleton */}
        <div className="rounded-xl bg-primary/20 px-8 py-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-36" />
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} size="sm">
              <CardHeader>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-1 h-4 w-24" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main grid skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-center pb-2">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <Skeleton className="h-px w-full" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-8 gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-52" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-8 gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RevenueChartSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-[300px]" />
      </CardContent>
    </Card>
  );
}

export function InvoiceStatusChartSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-6 w-56 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-[300px]" />
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

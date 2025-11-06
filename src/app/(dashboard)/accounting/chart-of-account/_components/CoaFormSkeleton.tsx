import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CoaFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-32 h-8" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

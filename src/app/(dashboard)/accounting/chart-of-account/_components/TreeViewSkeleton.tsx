import { Skeleton } from "@/components/ui/skeleton";

export const TreeViewSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="pl-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
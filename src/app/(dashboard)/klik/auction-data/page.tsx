import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AuctionForm from "./_components/AuctionForm";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

const AuctionDataPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Data Lelang</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <AuctionForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default AuctionDataPage;

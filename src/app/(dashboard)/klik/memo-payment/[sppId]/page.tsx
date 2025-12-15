import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import { sppShow } from "@/data/spp";
import MemoPaymentForm from "../_components/MemoPaymentForm";

type Params = Promise<{ sppId: number }>;

const RenderForm = async ({ sppId }: { sppId: number }) => {
  const result = await sppShow(sppId);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;

  return <MemoPaymentForm data={data} />;
};

const PaymentPage = async ({ params }: { params: Params }) => {
  const { sppId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>SPP</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PaymentFormSkeleton />}>
          <RenderForm sppId={sppId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PaymentPage;

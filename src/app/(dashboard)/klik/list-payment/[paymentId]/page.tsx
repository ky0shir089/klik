import { paymentShow } from "@/data/repayment";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import PaymentForm from "../_components/PaymentForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";

type Params = Promise<{ paymentId: number }>;

const RenderForm = async ({ paymentId }: { paymentId: number }) => {
  const result = await paymentShow(paymentId);
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

  return <PaymentForm data={data} />;
};

const ListPaymentPage = async ({ params }: { params: Params }) => {
  const { paymentId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>SPP</CardTitle>
      </CardHeader>

      <Suspense fallback={<PaymentFormSkeleton />}>
        <RenderForm paymentId={paymentId} />
      </Suspense>
    </Card>
  );
};

export default ListPaymentPage;

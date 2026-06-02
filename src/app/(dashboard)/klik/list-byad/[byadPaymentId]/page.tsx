import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import { byadPaymentShow } from "@/data/byad-payment";
import ByadDetail from "../_components/ByadDetail";

type Params = Promise<{ byadPaymentId: number }>;

const RenderForm = async ({ byadPaymentId }: { byadPaymentId: number }) => {
  const result = await byadPaymentShow(byadPaymentId);
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

  return <ByadDetail data={data} />;
};

const ListByadPage = async ({ params }: { params: Params }) => {
  const { byadPaymentId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>BYAD Payment Detail</CardTitle>
      </CardHeader>

      <Suspense fallback={<PaymentFormSkeleton />}>
        <RenderForm byadPaymentId={byadPaymentId} />
      </Suspense>
    </Card>
  );
};

export default ListByadPage;

import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import { rvClassificationShow } from "@/data/rv-classification";
import SppForm from "../_components/SppForm";

type Params = Promise<{ customerId: number }>;

const RenderForm = async ({ customerId }: { customerId: number }) => {
  const result = await rvClassificationShow(customerId);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;

  return <SppForm data={data} />;
};

const PaymentPage = async ({ params }: { params: Params }) => {
  const { customerId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Memo SPP</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PaymentFormSkeleton />}>
          <RenderForm customerId={customerId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PaymentPage;

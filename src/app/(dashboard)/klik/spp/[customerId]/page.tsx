import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import { rvClassificationShow } from "@/data/rv-classification";
import SppForm from "../_components/SppForm";

type Params = Promise<{ customerId: number }>;

const RenderForm = async ({ customerId }: { customerId: number }) => {
  const result = await rvClassificationShow(customerId);
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
  console.log(data);

  return <SppForm data={data} />;
};

const PaymentPage = async ({ params }: { params: Params }) => {
  const { customerId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>SPP</CardTitle>
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

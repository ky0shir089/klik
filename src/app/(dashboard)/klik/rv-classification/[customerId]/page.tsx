import { customerShow } from "@/data/customer";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import RvClassificationForm from "../_components/RvClassificationForm";

type Params = Promise<{ customerId: number }>;

const RenderForm = async ({ customerId }: { customerId: number }) => {
  const result = await customerShow(customerId);
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

  return <RvClassificationForm data={data} />;
};

const PaymentPage = async ({ params }: { params: Params }) => {
  const { customerId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Klasifikasi RV</CardTitle>
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

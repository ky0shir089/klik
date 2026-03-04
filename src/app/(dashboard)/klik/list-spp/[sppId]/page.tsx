import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import PaymentFormSkeleton from "@/components/PaymentFormSkeleton";
import { sppDetail } from "@/data/spp-v2";
import SppForm from "../_components/SppForm";

type Params = Promise<{ sppId: number }>;

const RenderForm = async ({ sppId }: { sppId: number }) => {
  const result = await sppDetail(sppId);
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

  return <SppForm data={data} />;
};

const SppDetailPage = async ({ params }: { params: Params }) => {
  const { sppId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">SPP Detail</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PaymentFormSkeleton />}>
          <div className="w-full">
            <RenderForm sppId={sppId} />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default SppDetailPage;

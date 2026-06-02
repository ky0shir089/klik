import { trxDtlShow } from "@/data/trx-dtl";
import TrxDtlForm from "../../_components/TrxDtlForm";
import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { selectCoa, selectTypeTrx } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ trxDtlId: number }>;

const RenderForm = async ({ trxDtlId }: { trxDtlId: number }) => {
  const [result, typeTrxResult, coaResult] = await Promise.all([
    trxDtlShow(trxDtlId),
    selectTypeTrx(),
    selectCoa("CHILDREN"),
  ]);
  await redirectIfUnauthorized(result, typeTrxResult, coaResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;
  const { data: trxes } = typeTrxResult;
  const { data: coas } = coaResult;

  return <TrxDtlForm data={data} trxes={trxes} coas={coas} />;
};

const EditTrxDtlPage = async ({ params }: { params: Params }) => {
  const { trxDtlId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Trx Detail</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm trxDtlId={trxDtlId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditTrxDtlPage;

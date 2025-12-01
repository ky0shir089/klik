import { trxDtlShow } from "@/data/trx-dtl";
import TrxDtlForm from "../../_components/TrxDtlForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectCoa, selectTypeTrx } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ trxDtlId: number }>;

const RenderForm = async ({ trxDtlId }: { trxDtlId: number }) => {
  const [result, { data: trxes }, { data: coas }] = await Promise.all([
    trxDtlShow(trxDtlId),
    selectTypeTrx(),
    selectCoa("CHILDREN"),
  ]);

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

  return <TrxDtlForm data={data} trxes={trxes} coas={coas} />;
};

const EditTrxDtlPage = async ({ params }: { params: Params }) => {
  const { trxDtlId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
          {trxDtlId ? "Edit" : "Create"} Trx Detail
        </CardTitle>
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

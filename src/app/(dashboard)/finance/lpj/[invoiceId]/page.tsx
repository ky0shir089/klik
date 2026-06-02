import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { selectPph, selectTypeTrx } from "@/data/select";
import LpjForm from "../_components/LpjForm";
import { settlementShow } from "@/data/settlement";

type Params = Promise<{ invoiceId: number }>;

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const [result, typeTrxResult, pphResult] = await Promise.all([
    settlementShow(invoiceId),
    selectTypeTrx("OUT"),
    selectPph(),
  ]);
  await redirectIfUnauthorized(result, typeTrxResult, pphResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;
  const { data: typeTrxes } = typeTrxResult;
  const { data: pphs } = pphResult;
  const invoice = {
    ...data.invoice,
    id: data.id,
    pv_id: data.prepayment_pv_id,
    balance: data.balance,
  };

  return <LpjForm data={invoice} typeTrxes={typeTrxes} pphs={pphs} />;
};

const EditInvoicePage = async ({ params }: { params: Params }) => {
  const { invoiceId } = await params;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm invoiceId={invoiceId} />
    </Suspense>
  );
};

export default EditInvoicePage;

import { selectPph, selectTypeTrx } from "@/data/select";
import InvoiceForm from "./_components/InvoiceForm";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const [typeTrxResult, pphResult] = await Promise.all([
    selectTypeTrx("OUT"),
    selectPph(),
  ]);
  await redirectIfUnauthorized(typeTrxResult, pphResult);

  const { data: typeTrxes } = typeTrxResult;
  const { data: pphs } = pphResult;

  return <InvoiceForm typeTrxes={typeTrxes} pphs={pphs} />;
};

const NewInvoicePage = () => {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm />
    </Suspense>
  );
};

export default NewInvoicePage;

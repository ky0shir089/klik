import { selectPph, selectTypeTrx } from "@/data/select";
import InvoiceForm from "./_components/InvoiceForm";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();

  const [{ data: typeTrxes }, { data: pphs }] = await Promise.all([
    selectTypeTrx("OUT"),
    selectPph(),
  ]);

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

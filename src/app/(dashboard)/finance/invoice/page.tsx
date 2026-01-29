import { selectPph, selectRv, selectTypeTrx } from "@/data/select";
import InvoiceForm from "./_components/InvoiceForm";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { supplierIndex } from "@/data/supplier";

const RenderForm = async () => {
  await connection();

  const [
    { data: typeTrxes },
    { data: suppliers },
    { data: pphs },
    { data: rvs },
  ] = await Promise.all([
    selectTypeTrx("OUT"),
    supplierIndex(1, 10),
    selectPph(),
    selectRv(1, 10),
  ]);

  return (
    <InvoiceForm
      suppliers={suppliers.data}
      typeTrxes={typeTrxes}
      pphs={pphs}
      rvs={rvs.data}
    />
  );
};

const NewInvoicePage = () => {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm />
    </Suspense>
  );
};

export default NewInvoicePage;

import { selectPph, selectRv, selectTypeTrx } from "@/data/select";
import InvoiceForm from "./_components/InvoiceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Invoice</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewInvoicePage;

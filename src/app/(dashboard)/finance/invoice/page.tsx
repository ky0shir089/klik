import { selectSupplier, selectTypeTrx } from "@/data/select";
import InvoiceForm from "./_components/InvoiceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();

  const [{ data: typeTrxes }, { data: suppliers }] = await Promise.all([
    selectTypeTrx("OUT"),
    selectSupplier(),
  ]);

  return <InvoiceForm suppliers={suppliers} typeTrxes={typeTrxes} />;
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

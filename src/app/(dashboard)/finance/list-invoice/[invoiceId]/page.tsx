import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import InvoiceForm from "../../invoice/_components/InvoiceForm";
import {
  selectPph,
  selectRv,
  selectTypeTrx,
} from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierIndex } from "@/data/supplier";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const [
    result,
    { data: typeTrxes },
    { data: suppliers },
    { data: pphs },
    { data: rvs },
  ] = await Promise.all([
    invoiceShow(invoiceId),
    selectTypeTrx("OUT"),
    supplierIndex(1, 10),
    selectPph(),
    selectRv(1, 10),
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

  return data.status === "REQUEST" ? (
    <InvoiceForm
      data={data}
      suppliers={suppliers.data}
      typeTrxes={typeTrxes}
      pphs={pphs}
      rvs={rvs.data}
    />
  ) : (
    <InvoiceAction data={data} />
  );
};

const EditInvoicePage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Invoice</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm invoiceId={invoiceId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditInvoicePage;

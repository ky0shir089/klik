import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import InvoiceForm from "../../invoice/_components/InvoiceForm";
import { selectPph, selectTypeTrx } from "@/data/select";
import { supplierShow } from "@/data/supplier";
import { rvClassificationShow } from "@/data/rv-classification";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const [result, { data: typeTrxes }, { data: pphs }] = await Promise.all([
    invoiceShow(invoiceId),
    selectTypeTrx("OUT"),
    selectPph(),
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
  const [{ data: suppliers }, { data: rvs }] = await Promise.all([
    supplierShow(data.supplier_id),
    rvClassificationShow(data.rv_id),
  ]);

  return data.status === "REQUEST" ? (
    <InvoiceForm
      data={data}
      suppliers={[suppliers]}
      typeTrxes={typeTrxes}
      pphs={pphs}
      rvs={[rvs]}
    />
  ) : (
    <InvoiceAction data={data} />
  );
};

const EditInvoicePage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm invoiceId={invoiceId} />
    </Suspense>
  );
};

export default EditInvoicePage;

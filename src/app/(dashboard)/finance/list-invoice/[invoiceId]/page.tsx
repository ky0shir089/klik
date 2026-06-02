import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import InvoiceForm from "../../invoice/_components/InvoiceForm";
import { selectPph, selectTypeTrx } from "@/data/select";

type Params = Promise<{ invoiceId: number }>;

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

  return data.status === "REQUEST" ? (
    <InvoiceForm data={data} typeTrxes={typeTrxes} pphs={pphs} />
  ) : (
    <InvoiceAction data={data} />
  );
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

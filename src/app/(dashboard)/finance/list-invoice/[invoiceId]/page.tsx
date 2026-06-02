import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ invoiceId: number }>;

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const result = await invoiceShow(invoiceId);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  return <InvoiceAction data={data} />;
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

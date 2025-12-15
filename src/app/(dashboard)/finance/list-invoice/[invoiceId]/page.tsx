import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const result = await invoiceShow(invoiceId);

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

  return <InvoiceAction data={data} />;
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

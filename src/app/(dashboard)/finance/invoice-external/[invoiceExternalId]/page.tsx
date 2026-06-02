import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { invoiceExternalShow } from "@/data/invoice-external";
import InvoiceExternalData from "../_components/InvoiceExternalData";

type Params = Promise<{ invoiceExternalId: number }>;

const RenderForm = async ({
  invoiceExternalId,
}: {
  invoiceExternalId: number;
}) => {
  const [result] = await Promise.all([invoiceExternalShow(invoiceExternalId)]);

  await redirectIfUnauthorized(result);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  return <InvoiceExternalData data={data} />;
};

const EditInvoicePage = async ({ params }: { params: Params }) => {
  const { invoiceExternalId } = await params;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm invoiceExternalId={invoiceExternalId} />
    </Suspense>
  );
};

export default EditInvoicePage;

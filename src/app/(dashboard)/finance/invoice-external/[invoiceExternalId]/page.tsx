import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import InvoiceExternalForm from "../_components/InvoiceExternalForm";
import { invoiceExternalShow } from "@/data/invoice-external";
import { differenceInDays } from "date-fns";

type Params = Promise<{ invoiceExternalId: number }>;

const RenderForm = async ({
  invoiceExternalId,
}: {
  invoiceExternalId: number;
}) => {
  const [result] = await Promise.all([invoiceExternalShow(invoiceExternalId)]);

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
  const fixedData = {
    ...data,
    due_date: differenceInDays(new Date(data.due_date), new Date(data.date)),
  };

  return <InvoiceExternalForm data={fixedData} />;
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

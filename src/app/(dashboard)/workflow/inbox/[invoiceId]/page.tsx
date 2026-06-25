import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import {
  redirectIfUnauthorized,
  redirectToMissingSession,
} from "@/lib/server-auth";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { getSessionUser } from "@/lib/session-user";
import { sppInbox } from "@/data/inbox";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const result = await invoiceShow(invoiceId);
  const user = await getSessionUser();

  if (!user) {
    await redirectToMissingSession();
  }

  const sessionUser = user!;
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  let spp = [];
  if (data.trx_id == 2) {
    spp = await sppInbox(data.invoice_no);
  }

  return <InvoiceAction data={data} user={sessionUser} spp={spp.data} />;
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

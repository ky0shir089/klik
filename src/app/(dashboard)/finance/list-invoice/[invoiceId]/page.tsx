import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const EditInvoicePage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

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

export default EditInvoicePage;

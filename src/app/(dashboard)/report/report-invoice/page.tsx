import { connection } from "next/server";
import ReportInvoiceForm from "./_components/ReportInvoiceForm";

const ReportInvoicePage = async () => {
  await connection();

  return <ReportInvoiceForm />;
};

export default ReportInvoicePage;

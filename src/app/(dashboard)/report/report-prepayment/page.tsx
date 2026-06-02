import { connection } from "next/server";
import ReportPrepaymentForm from "./_components/ReportPrepaymentForm";

const ReportInvoicePage = async () => {
  await connection();

  return <ReportPrepaymentForm />;
};

export default ReportInvoicePage;

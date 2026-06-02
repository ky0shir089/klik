import { connection } from "next/server";
import ReportExternalForm from "./_components/ReportExternalForm";

const ReportInvoicePage = async () => {
  await connection();

  return <ReportExternalForm />;
};

export default ReportInvoicePage;

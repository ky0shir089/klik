import { selectCoa } from "@/data/select";
import ReportCashForm from "./_components/ReportCashForm";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const ReportCashPage = async () => {
  await connection();

  const result = await selectCoa("KAS");
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <ReportCashForm cashes={data} />;
};

export default ReportCashPage;

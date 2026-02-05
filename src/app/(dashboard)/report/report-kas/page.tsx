import { selectCoa } from "@/data/select";
import ReportCashForm from "./_components/ReportCashForm";
import { connection } from "next/server";

const ReportCashPage = async () => {
  await connection();

  const { data } = await selectCoa("KAS");

  return <ReportCashForm cashes={data} />;
};

export default ReportCashPage;

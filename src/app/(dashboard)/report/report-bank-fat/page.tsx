import { selectCoa } from "@/data/select";
import ReportBankForm from "./_components/ReportBankForm";
import { connection } from "next/server";

const ReportBankPage = async () => {
  await connection();

  const { data } = await selectCoa("BANK");

  return <ReportBankForm banks={data} />;
};

export default ReportBankPage;

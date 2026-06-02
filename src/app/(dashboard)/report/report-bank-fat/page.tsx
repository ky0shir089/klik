import { selectCoa } from "@/data/select";
import ReportBankForm from "./_components/ReportBankForm";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const ReportBankPage = async () => {
  await connection();

  const result = await selectCoa("BANK");
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <ReportBankForm banks={data} />;
};

export default ReportBankPage;

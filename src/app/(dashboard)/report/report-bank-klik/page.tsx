import { selectCoa } from "@/data/select";
import { connection } from "next/server";
import ReportBankForm from "./_components/ReportBankForm";
import { coaShowType } from "@/data/coa";

const ReportBankPage = async () => {
  await connection();

  const { data } = await selectCoa("BANK");
  const banks = data.filter((bank: coaShowType) => bank.id >= 8);

  return <ReportBankForm banks={banks} />;
};

export default ReportBankPage;

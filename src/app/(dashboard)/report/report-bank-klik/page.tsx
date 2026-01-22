import { selectCoa } from "@/data/select";
import { connection } from "next/server";
import ReportBankForm from "./_components/ReportBankForm";
import { coaShowType } from "@/data/coa";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

const RenderForm = async () => {
  await connection();
  const { data } = await selectCoa("BANK");
  const banks = data.filter((bank: coaShowType) => bank.id >= 8);
  return <ReportBankForm banks={banks} />;
};

const ReportBankPage = () => {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm />
    </Suspense>
  );
};

export default ReportBankPage;

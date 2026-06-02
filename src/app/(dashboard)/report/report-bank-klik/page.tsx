import { selectCoa } from "@/data/select";
import { connection } from "next/server";
import ReportBankForm from "./_components/ReportBankForm";
import { coaShowType } from "@/data/coa";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();
  const result = await selectCoa("BANK");
  await redirectIfUnauthorized(result);

  const { data } = result;
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

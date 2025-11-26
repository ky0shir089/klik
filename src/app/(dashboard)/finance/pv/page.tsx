import { selectBankAccount, selectUnpaidPayment } from "@/data/select";
import PvForm from "./_components/PvForm";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/unauthorized";
import { connection } from "next/server";
import { paymentShow } from "@/data/repayment";
import { invoiceShow } from "@/data/invoice";

type searchParams = Promise<{ paymentId: number; typeTrx: number }>;

const PvPage = async ({ searchParams }: { searchParams: searchParams }) => {
  await connection();

  const { paymentId, typeTrx } = await searchParams;

  const [result, { data: bankAccounts }, { data: payment }] = await Promise.all(
    [
      selectUnpaidPayment(),
      selectBankAccount(),
      paymentId && typeTrx == 2
        ? paymentShow(paymentId)
        : invoiceShow(paymentId),
    ]
  );
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;

  return (
    <PvForm
      bankAccounts={bankAccounts}
      data={data}
      payment={payment}
    />
  );
};

export default PvPage;

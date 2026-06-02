import { selectBankAccount, selectUnpaidPayment } from "@/data/select";
import PvForm from "./_components/PvForm";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import Unauthorized from "@/components/unauthorized";
import { paymentShow } from "@/data/repayment";
import { invoiceShow } from "@/data/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PvFormSkeleton from "./_components/PvFormSkeleton";

type searchParams = Promise<{
  method: string;
  paymentId: number;
  typeTrx: number;
}>;

const RenderForm = async ({
  method,
  paymentId,
  typeTrx,
}: {
  method: string;
  paymentId: number;
  typeTrx: number;
}) => {
  const [result, bankAccountResult, paymentResult] = await Promise.all([
    selectUnpaidPayment(method),
    selectBankAccount(),
    paymentId
      ? typeTrx == 2
        ? paymentShow(paymentId)
        : invoiceShow(paymentId)
      : Promise.resolve(null),
  ]);
  await redirectIfUnauthorized(result, bankAccountResult, paymentResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: bankAccounts } = bankAccountResult;
  const payment =
    typeof paymentResult === "object" &&
    paymentResult !== null &&
    "data" in paymentResult
      ? paymentResult.data
      : undefined;

  return <PvForm bankAccounts={bankAccounts} data={data} payment={payment} />;
};

const PvPage = async ({ searchParams }: { searchParams: searchParams }) => {
  const { method, paymentId, typeTrx } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Pembayaran</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PvFormSkeleton />}>
          <RenderForm method={method} paymentId={paymentId} typeTrx={typeTrx} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PvPage;

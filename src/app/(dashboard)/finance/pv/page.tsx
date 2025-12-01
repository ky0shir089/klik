import { selectBankAccount, selectUnpaidPayment } from "@/data/select";
import PvForm from "./_components/PvForm";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/unauthorized";
import { paymentShow } from "@/data/repayment";
import { invoiceShow } from "@/data/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PvFormSkeleton from "./_components/PvFormSkeleton";

type searchParams = Promise<{ paymentId: number; typeTrx: number }>;

const RenderForm = async ({
  paymentId,
  typeTrx,
}: {
  paymentId: number;
  typeTrx: number;
}) => {
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

  return <PvForm bankAccounts={bankAccounts} data={data} payment={payment} />;
};

const PvPage = async ({ searchParams }: { searchParams: searchParams }) => {
  const { paymentId, typeTrx } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Pembayaran</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PvFormSkeleton />}>
          <RenderForm paymentId={paymentId} typeTrx={typeTrx} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PvPage;

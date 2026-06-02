import {
  selectBankAccount,
  selectExternal,
  selectMoneyInTransit,
  selectTypeTrx,
} from "@/data/select";
import RvForm from "./_components/RvForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const [
    typeTrxResult,
    bankAccountResult,
    moneyInTransitResult,
    externalResult,
  ] = await Promise.all([
    selectTypeTrx("IN"),
    selectBankAccount(),
    selectMoneyInTransit(),
    selectExternal(),
  ]);
  await redirectIfUnauthorized(
    typeTrxResult,
    bankAccountResult,
    moneyInTransitResult,
    externalResult,
  );

  const { data: typeTrxes } = typeTrxResult;
  const { data: bankAccounts } = bankAccountResult;
  const { data: moneyInTransit } = moneyInTransitResult;
  const { data: externals } = externalResult;

  return (
    <RvForm
      bankAccounts={bankAccounts}
      typeTrxes={typeTrxes}
      moneyInTransit={moneyInTransit}
      externals={externals}
    />
  );
};

const NewRvPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Receive Voucher</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewRvPage;

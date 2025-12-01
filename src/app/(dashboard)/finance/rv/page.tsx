import { selectBankAccount, selectTypeTrx } from "@/data/select";
import RvForm from "./_components/RvForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  const [{ data: typeTrxes }, { data: bankAccounts }] = await Promise.all([
    selectTypeTrx("IN"),
    selectBankAccount(),
  ]);

  return <RvForm bankAccounts={bankAccounts} typeTrxes={typeTrxes} />;
};

const NewRvPage = async () => {
  await connection();
  
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

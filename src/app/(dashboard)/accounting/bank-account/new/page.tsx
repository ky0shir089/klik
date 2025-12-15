import { selectBank, selectCoa } from "@/data/select";
import BankAccountForm from "../_components/BankAccountForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();

  const [{ data: banks }, { data: coas }] = await Promise.all([
    selectBank(),
    selectCoa("BANK"),
  ]);

  return <BankAccountForm banks={banks} coas={coas} />;
};

const NewBankAccountPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Bank Account</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewBankAccountPage;

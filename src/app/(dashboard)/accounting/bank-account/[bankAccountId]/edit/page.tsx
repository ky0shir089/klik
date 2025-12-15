import { bankAccountShow } from "@/data/bank-account";
import BankAccountForm from "../../_components/BankAccountForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectBank, selectCoa } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ bankAccountId: number }>;

const RenderForm = async ({ bankAccountId }: { bankAccountId: number }) => {
  const [result, { data: banks }, { data: coas }] = await Promise.all([
    bankAccountShow(bankAccountId),
    selectBank(),
    selectCoa("BANK"),
  ]);

  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  return <BankAccountForm data={data} banks={banks} coas={coas} />;
};

const EditBankAccountPage = async ({ params }: { params: Params }) => {
  const { bankAccountId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Bank Account</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm bankAccountId={bankAccountId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditBankAccountPage;

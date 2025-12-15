import { bankShow } from "@/data/bank";
import BankForm from "../../_components/BankForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ bankId: number }>;

const RenderForm = async ({ bankId }: { bankId: number }) => {
  const result = await bankShow(bankId);

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

  return <BankForm data={data} />;
};

const EditBankPage = async ({ params }: { params: Params }) => {
  const { bankId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
         Edit Bank
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm bankId={bankId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditBankPage;

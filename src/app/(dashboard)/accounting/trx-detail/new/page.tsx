import { selectCoa, selectTypeTrx } from "@/data/select";
import TrxDtlForm from "../_components/TrxDtlForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const [typeTrxResult, coaResult] = await Promise.all([
    selectTypeTrx(),
    selectCoa("CHILDREN"),
  ]);
  await redirectIfUnauthorized(typeTrxResult, coaResult);

  const { data: trxes } = typeTrxResult;
  const { data: coas } = coaResult;

  return <TrxDtlForm trxes={trxes} coas={coas} />;
};

const NewTrxDtlPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Trx Detail</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewTrxDtlPage;

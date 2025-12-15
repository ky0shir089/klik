import { selectCoa, selectTypeTrx } from "@/data/select";
import TrxDtlForm from "../_components/TrxDtlForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();
  
  const [{ data: trxes }, { data: coas }] = await Promise.all([
    selectTypeTrx(),
    selectCoa("CHILDREN"),
  ]);

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

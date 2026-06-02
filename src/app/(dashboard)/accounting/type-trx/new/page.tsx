import TypeTrxForm from "../_components/TypeTrxForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { selectRole } from "@/data/select";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const result = await selectRole();
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <TypeTrxForm roles={data} />;
};

const NewTypeTrxPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Type Trx</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewTypeTrxPage;

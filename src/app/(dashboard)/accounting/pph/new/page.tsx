import { selectCoa } from "@/data/select";
import PphForm from "../_components/PphForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const result = await selectCoa("CHILDREN");
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <PphForm coas={data} />;
};

const NewPphPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create PPH</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewPphPage;

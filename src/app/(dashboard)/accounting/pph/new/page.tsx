import { selectCoa } from "@/data/select";
import PphForm from "../_components/PphForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();

  const { data } = await selectCoa("CHILDREN");

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

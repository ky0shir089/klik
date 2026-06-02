import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { selectTypeTrx, selectUser } from "@/data/select";
import WorkflowForm from "../_components/WorkflowForm";

const RenderForm = async () => {
  await connection();

  const [{ data: users }, { data: typeTrxes }] = await Promise.all([
    selectUser(),
    selectTypeTrx(),
  ]);

  return <WorkflowForm users={users} typeTrxes={typeTrxes} />;
};

const NewWorkflowPage = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Workflow</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewWorkflowPage;

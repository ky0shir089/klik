import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { selectTypeTrx, selectUser } from "@/data/select";
import { workflowShow } from "@/data/workflow";
import WorkflowForm from "../../_components/WorkflowForm";

type Params = Promise<{ wfId: number }>;

const RenderForm = async ({ wfId }: { wfId: number }) => {
  const [result, { data: users }, { data: typeTrxes }] = await Promise.all([
    workflowShow(wfId),
    selectUser(),
    selectTypeTrx(),
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
  console.log(data);

  return <WorkflowForm data={data} users={users} typeTrxes={typeTrxes} />;
};

const EditWorkflowPage = async ({ params }: { params: Params }) => {
  const { wfId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Workflow</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm wfId={wfId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditWorkflowPage;

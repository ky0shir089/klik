import { moduleShow } from "@/data/module";
import ModuleForm from "../../_components/ModuleForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ moduleId: number }>;

const RenderForm = async ({ moduleId }: { moduleId: number }) => {
  const result = await moduleShow(moduleId);

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

  return <ModuleForm data={data} />;
};

const EditModulePage = async ({ params }: { params: Params }) => {
  const { moduleId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Module</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm moduleId={moduleId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditModulePage;

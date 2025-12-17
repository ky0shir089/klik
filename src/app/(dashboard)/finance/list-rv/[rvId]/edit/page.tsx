import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { rvShow } from "@/data/rv";
import RemoveRvForm from "../../_components/RemoveRvForm";

type Params = Promise<{ rvId: number }>;

const RenderForm = async ({ rvId }: { rvId: number }) => {
  const result = await rvShow(rvId);

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

  return <RemoveRvForm data={data} />;
};

const EditRvPage = async ({ params }: { params: Params }) => {
  const { rvId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Rv</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm rvId={rvId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditRvPage;

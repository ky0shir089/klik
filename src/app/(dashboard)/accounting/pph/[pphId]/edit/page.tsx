import { pphShow } from "@/data/pph";
import PphForm from "../../_components/PphForm";
import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { selectCoa } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ pphId: number }>;

const RenderForm = async ({ pphId }: { pphId: number }) => {
  const [result, coaResult] = await Promise.all([
    pphShow(pphId),
    selectCoa("CHILDREN"),
  ]);
  await redirectIfUnauthorized(result, coaResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;
  const { data: coas } = coaResult;

  return <PphForm data={data} coas={coas} />;
};

const EditPphPage = async ({ params }: { params: Params }) => {
  const { pphId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Pph Detail</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm pphId={pphId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditPphPage;

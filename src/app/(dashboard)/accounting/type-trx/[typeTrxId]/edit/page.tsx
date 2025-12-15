import { typeTrxShow } from "@/data/type-trx";
import TypeTrxForm from "../../_components/TypeTrxForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { cn } from "@/lib/utils";

type Params = Promise<{ typeTrxId: number }>;

const RenderForm = async ({ typeTrxId }: { typeTrxId: number }) => {
  const result = await typeTrxShow(typeTrxId);

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

  return <TypeTrxForm data={data} />;
};

const EditTypeTrxPage = async ({ params }: { params: Params }) => {
  const { typeTrxId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Type Trx</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm typeTrxId={typeTrxId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditTypeTrxPage;

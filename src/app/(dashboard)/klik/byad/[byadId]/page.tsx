import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { byadShow } from "@/data/byad";
import ByadDetail from "../_components/ByadDetail";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ byadId: number }>;
}

const RenderDetail = async ({ byadId }: { byadId: number }) => {
  const result = await byadShow(byadId);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Detail Pembuatan BYAD</CardTitle>
      </CardHeader>
      <CardContent>
        <ByadDetail data={data} />
      </CardContent>
    </Card>
  );
};

const ByadDetailPage = async ({ params }: PageProps) => {
  const { byadId } = await params;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderDetail byadId={byadId} />
    </Suspense>
  );
};

export default ByadDetailPage;

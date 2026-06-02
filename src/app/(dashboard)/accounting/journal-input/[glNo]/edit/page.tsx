import { selectCoa } from "@/data/select";
import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import JournalForm from "../../components/JournalForm";
import { journalShow } from "@/data/journal-input";

type Params = Promise<{ glNo: string }>;

const RenderForm = async ({ glNo }: { glNo: string }) => {
  const [result, coaResult] = await Promise.all([
    journalShow(glNo),
    selectCoa(),
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

  return <JournalForm data={data} coas={coas} />;
};

const ViewJournalPage = async ({ params }: { params: Params }) => {
  const { glNo } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>View Journal</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm glNo={glNo} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default ViewJournalPage;

import { selectCoa } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import JournalForm from "./components/JournalForm";

const RenderForm = async () => {
  await connection();

  const { data: coas } = await selectCoa();

  return <JournalForm coas={coas} />;
};

const JournalInputPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Input Jurnal</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default JournalInputPage;

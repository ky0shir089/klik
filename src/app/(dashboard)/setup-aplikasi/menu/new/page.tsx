import { selectModule } from "@/data/select";
import MenuForm from "../_components/MenuForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const result = await selectModule();
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <MenuForm modules={data} />;
};

const NewMenuPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Menu</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewMenuPage;

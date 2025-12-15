import MenuForm from "../../_components/MenuForm";
import { selectModule } from "@/data/select";
import Unauthorized from "@/components/unauthorized";
import { menuShow } from "@/data/menu";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ menuId: number }>;

const RenderForm = async ({ menuId }: { menuId: number }) => {
  const [result, { data: modules }] = await Promise.all([
    menuShow(menuId),
    selectModule(),
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

  return <MenuForm data={data} modules={modules} />;
};

const EditMenuPage = async ({ params }: { params: Params }) => {
  const { menuId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Menu</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm menuId={menuId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditMenuPage;

import { roleShow } from "@/data/role";
import Unauthorized from "@/components/unauthorized";
import { selectMenuPermission } from "@/data/select";
import { notFound, redirect } from "next/navigation";
import RoleForm from "../../_components/RoleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ roleId: number }>;

const RenderForm = async ({ roleId }: { roleId: number }) => {
  const [result, { data: menuPermission }] = await Promise.all([
    roleShow(roleId),
    selectMenuPermission(),
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

  return <RoleForm data={data} menuPermission={menuPermission} />;
};

const EditRolePage = async ({ params }: { params: Params }) => {
  const { roleId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Role</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm roleId={roleId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditRolePage;

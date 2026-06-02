import UserForm from "../../_components/UserForm";
import { selectRole } from "@/data/select";
import Unauthorized from "@/components/unauthorized";
import { userShow } from "@/data/user";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

type Params = Promise<{ userId: number }>;

const RenderForm = async ({ userId }: { userId: number }) => {
  const [result, roleResult] = await Promise.all([
    userShow(userId),
    selectRole(),
  ]);
  await redirectIfUnauthorized(result, roleResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;
  const { data: roles } = roleResult;

  return <UserForm data={data} roles={roles} />;
};

const EditUserPage = async ({ params }: { params: Params }) => {
  const { userId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit User</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm userId={userId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditUserPage;

import { selectBank } from "@/data/select";
import SupplierForm from "../_components/SupplierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/unauthorized";

const RenderForm = async () => {
  await connection();

  const result = await selectBank();
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data: banks } = result;

  return <SupplierForm banks={banks} />;
};

const NewSupplierPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Supplier</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewSupplierPage;

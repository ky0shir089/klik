import { supplierShow } from "@/data/supplier";
import SupplierForm from "../../_components/SupplierForm";
import Unauthorized from "@/components/unauthorized";
import { notFound } from "next/navigation";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { selectBank } from "@/data/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import { connection } from "next/server";

type Params = Promise<{ supplierId: number }>;

const RenderForm = async ({ supplierId }: { supplierId: number }) => {
  await connection();

  const [result, bankResult] = await Promise.all([
    supplierShow(supplierId),
    selectBank(),
  ]);
  await redirectIfUnauthorized(result, bankResult);

  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;
  const { data: banks } = bankResult;

  return <SupplierForm data={data} banks={banks} />;
};

const EditSupplierPage = async ({ params }: { params: Params }) => {
  const { supplierId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Supplier</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm supplierId={supplierId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditSupplierPage;

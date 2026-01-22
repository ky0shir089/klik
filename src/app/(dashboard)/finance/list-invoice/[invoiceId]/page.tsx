import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { invoiceShow } from "@/data/invoice";
import InvoiceAction from "../_components/InvoiceAction";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import InvoiceForm from "../../invoice/_components/InvoiceForm";
import {
  selectPph,
  selectRv,
  selectSupplier,
  selectTypeTrx,
} from "@/data/select";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ invoiceId: number }>;
}

const RenderForm = async ({ invoiceId }: { invoiceId: number }) => {
  const [
    result,
    { data: typeTrxes },
    { data: suppliers },
    { data: pphs },
    { data: rvs },
  ] = await Promise.all([
    invoiceShow(invoiceId),
    selectTypeTrx("OUT"),
    selectSupplier(),
    selectPph(),
    selectRv(),
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

  return data.status === "REQUEST" ? (
    <InvoiceForm
      data={data}
      suppliers={suppliers}
      typeTrxes={typeTrxes}
      pphs={pphs}
      rvs={rvs}
    />
  ) : (
    <InvoiceAction data={data} />
  );
};

const EditInvoicePage = async ({ params }: PageProps) => {
  const { invoiceId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Edit Invoice</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm invoiceId={invoiceId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default EditInvoicePage;

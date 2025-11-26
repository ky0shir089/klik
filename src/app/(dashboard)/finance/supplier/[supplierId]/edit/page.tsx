import { supplierShow } from "@/data/supplier";
import SupplierForm from "../../_components/SupplierForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectBank } from "@/data/select";

type Params = Promise<{ supplierId: number }>;

const EditSupplierPage = async ({ params }: { params: Params }) => {
  const { supplierId } = await params;
  const [result, { data: banks }] = await Promise.all([
    supplierShow(supplierId),
    selectBank(),
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

  return <SupplierForm data={data} banks={banks} />;
};

export default EditSupplierPage;

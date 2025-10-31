import { coaShow } from "@/data/coa";
import CoaForm from "../../_components/CoaForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectCoa } from "@/data/select";

type Params = Promise<{ coaId: number }>;

const EditCoaPage = async ({ params }: { params: Params }) => {
  const { coaId } = await params;
  const result = await coaShow(coaId);
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
  const { data: coa } = await selectCoa();

  return <CoaForm data={data} coa={coa} />;
};

export default EditCoaPage;

import { typeTrxShow } from "@/data/type-trx";
import TypeTrxForm from "../../_components/TypeTrxForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectCoa } from "@/data/select";

type Params = Promise<{ typeTrxId: number }>;

const EditTypeTrxPage = async ({ params }: { params: Params }) => {
  const { typeTrxId } = await params;
  const result = await typeTrxShow(typeTrxId);
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

  return <TypeTrxForm data={data} coa={coa} />;
};

export default EditTypeTrxPage;

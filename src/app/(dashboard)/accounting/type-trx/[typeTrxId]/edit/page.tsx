import { typeTrxShow } from "@/data/type-trx";
import TypeTrxForm from "../../_components/TypeTrxForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";

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

  return <TypeTrxForm data={data} />;
};

export default EditTypeTrxPage;

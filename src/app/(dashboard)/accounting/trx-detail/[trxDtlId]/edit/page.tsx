import { trxDtlShow } from "@/data/trx-dtl";
import TrxDtlForm from "../../_components/TrxDtlForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectCoa, selectTypeTrx } from "@/data/select";

type Params = Promise<{ trxDtlId: number }>;

const EditTrxDtlPage = async ({ params }: { params: Params }) => {
  const { trxDtlId } = await params;
  const result = await trxDtlShow(trxDtlId);
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

  const [{ data: trxes }, { data: coas }] = await Promise.all([
    selectTypeTrx("IN"),
    selectCoa(),
  ]);

  return <TrxDtlForm data={data} trxes={trxes} coas={coas} />;
};

export default EditTrxDtlPage;

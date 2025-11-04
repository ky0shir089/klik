import { trxDtlShow } from "@/data/trx-dtl";
import TrxDtlForm from "../../_components/TrxDtlForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectCoa, selectTypeTrx } from "@/data/select";

type Params = Promise<{ TrxDtlId: number }>;

const EditTrxDtlPage = async ({ params }: { params: Params }) => {
  const { TrxDtlId } = await params;
  const result = await trxDtlShow(TrxDtlId);
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

  const { data: trxes } = await selectTypeTrx("IN");
  const { data: coas } = await selectCoa();

  return <TrxDtlForm data={data} trxes={trxes} coas={coas} />;
};

export default EditTrxDtlPage;

import { selectCoa, selectTypeTrx } from "@/data/select";
import TrxDtlForm from "../_components/TrxDtlForm";

const NewTrxDtlPage = async () => {
  const { data: trxes } = await selectTypeTrx("IN");
  const { data: coas } = await selectCoa();

  return <TrxDtlForm trxes={trxes} coas={coas} />;
};

export default NewTrxDtlPage;

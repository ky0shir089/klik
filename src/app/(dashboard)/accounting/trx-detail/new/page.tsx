import { selectCoa, selectTypeTrx } from "@/data/select";
import TrxDtlForm from "../_components/TrxDtlForm";

const NewTrxDtlPage = async () => {
  const [{ data: trxes }, { data: coas }] = await Promise.all([
    selectTypeTrx("IN"),
    selectCoa(),
  ]);

  return <TrxDtlForm trxes={trxes} coas={coas} />;
};

export default NewTrxDtlPage;

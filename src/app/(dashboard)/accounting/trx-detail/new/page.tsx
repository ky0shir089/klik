import { selectCoa, selectTypeTrx } from "@/data/select";
import TrxDtlForm from "../_components/TrxDtlForm";
import { connection } from "next/server";

const NewTrxDtlPage = async () => {
  await connection();

  const [{ data: trxes }, { data: coas }] = await Promise.all([
    selectTypeTrx("IN"),
    selectCoa(),
  ]);

  return <TrxDtlForm trxes={trxes} coas={coas} />;
};

export default NewTrxDtlPage;

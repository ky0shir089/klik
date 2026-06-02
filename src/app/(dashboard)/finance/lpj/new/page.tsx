import { selectPph, selectTypeTrx } from "@/data/select";
import { connection } from "next/server";
import LpjForm from "../_components/LpjForm";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const NewLpjPage = async () => {
  await connection();

  const [typeTrxResult, pphResult] = await Promise.all([
    selectTypeTrx("OUT"),
    selectPph(),
  ]);
  await redirectIfUnauthorized(typeTrxResult, pphResult);

  const { data: typeTrxes } = typeTrxResult;
  const { data: pphs } = pphResult;

  return <LpjForm typeTrxes={typeTrxes} pphs={pphs} />;
};

export default NewLpjPage;

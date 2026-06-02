import { selectPph, selectTypeTrx } from "@/data/select";
import { connection } from "next/server";
import LpjForm from "../_components/LpjForm";

const NewLpjPage = async () => {
  await connection();

  const [{ data: typeTrxes }, { data: pphs }] = await Promise.all([
    selectTypeTrx("OUT"),
    selectPph(),
  ]);

  return <LpjForm typeTrxes={typeTrxes} pphs={pphs} />;
};

export default NewLpjPage;

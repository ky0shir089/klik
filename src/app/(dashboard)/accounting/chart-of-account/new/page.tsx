import { selectCoa } from "@/data/select";
import CoaForm from "../_components/CoaForm";
import { connection } from "next/server";

const NewCoaPage = async () => {
  await connection();

  const { data } = await selectCoa();

  return <CoaForm coa={data} />;
};

export default NewCoaPage;

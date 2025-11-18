import { selectCoa } from "@/data/select";
import CoaForm from "../_components/CoaForm";
import { connection } from "next/server";

const NewCoaPage = async () => {
  await connection();

  const { data } = await selectCoa("PARENT");

  return <CoaForm coas={data} />;
};

export default NewCoaPage;

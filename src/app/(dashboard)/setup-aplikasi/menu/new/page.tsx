import { selectModule } from "@/data/select";
import MenuForm from "../_components/MenuForm";
import { connection } from "next/server";

const NewMenuPage = async () => {
  await connection();

  const { data } = await selectModule();

  return <MenuForm modules={data} />;
};

export default NewMenuPage;

import { selectModule } from "@/data/select";
import MenuForm from "../_components/MenuForm";

const NewMenuPage = async () => {
  const { data } = await selectModule();

  return <MenuForm modules={data} />;
};

export default NewMenuPage;

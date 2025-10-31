import { selectCoa } from "@/data/select";
import CoaForm from "../_components/CoaForm";

const NewCoaPage = async () => {
  const { data } = await selectCoa();
  
  return <CoaForm coa={data} />;
};

export default NewCoaPage;

import { selectCoa } from "@/data/select";
import TypeTrxForm from "../_components/TypeTrxForm";

const NewTypeTrxPage = async () => {
  const { data } = await selectCoa();

  return <TypeTrxForm coa={data} />;
};

export default NewTypeTrxPage;

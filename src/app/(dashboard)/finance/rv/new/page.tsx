import { selectBankAccount, selectTypeTrx } from "@/data/select";
import RvForm from "../_components/RvForm";

const NewRvPage = async () => {
  const { data: typeTrxes } = await selectTypeTrx("IN");
  const { data: bankAccounts } = await selectBankAccount();

  return <RvForm bankAccounts={bankAccounts} typeTrxes={typeTrxes} />;
};

export default NewRvPage;

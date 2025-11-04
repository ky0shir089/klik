import { selectBank, selectCoa } from "@/data/select";
import BankAccountForm from "../_components/BankAccountForm";

const NewBankAccountPage = async () => {
  const { data: banks } = await selectBank();
  const { data: coas } = await selectCoa();

  return <BankAccountForm banks={banks} coas={coas} />;
};

export default NewBankAccountPage;

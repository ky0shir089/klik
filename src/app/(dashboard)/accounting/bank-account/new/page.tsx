import { selectBank, selectCoa } from "@/data/select";
import BankAccountForm from "../_components/BankAccountForm";
import { connection } from "next/server";

const NewBankAccountPage = async () => {
  await connection();

  const [{ data: banks }, { data: coas }] = await Promise.all([
    selectBank(),
    selectCoa("BANK"),
  ]);

  return <BankAccountForm banks={banks} coas={coas} />;
};

export default NewBankAccountPage;

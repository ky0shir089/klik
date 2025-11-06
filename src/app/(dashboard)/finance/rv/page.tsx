import { selectBankAccount, selectTypeTrx } from "@/data/select";
import RvForm from "./_components/RvForm";
import { connection } from "next/server";

const NewRvPage = async () => {
  await connection();

  const [{ data: typeTrxes }, { data: bankAccounts }] = await Promise.all([
    selectTypeTrx("IN"),
    selectBankAccount(),
  ]);

  return <RvForm bankAccounts={bankAccounts} typeTrxes={typeTrxes} />;
};

export default NewRvPage;

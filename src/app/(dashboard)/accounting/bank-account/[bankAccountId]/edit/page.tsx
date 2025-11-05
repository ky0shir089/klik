import { bankAccountShow } from "@/data/bank-account";
import BankAccountForm from "../../_components/BankAccountForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectBank, selectCoa } from "@/data/select";

type Params = Promise<{ bankAccountId: number }>;

const EditBankAccountPage = async ({ params }: { params: Params }) => {
  const { bankAccountId } = await params;
  const result = await bankAccountShow(bankAccountId);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;

  const [{ data: banks }, { data: coas }] = await Promise.all([
    selectBank(),
    selectCoa(),
  ]);

  return <BankAccountForm data={data} banks={banks} coas={coas} />;
};

export default EditBankAccountPage;

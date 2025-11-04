import { bankShow } from "@/data/bank";
import BankForm from "../../_components/BankForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";

type Params = Promise<{ bankId: number }>;

const EditBankPage = async ({ params }: { params: Params }) => {
  const { bankId } = await params;
  const result = await bankShow(bankId);
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

  return <BankForm data={data} />;
};

export default EditBankPage;

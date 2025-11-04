import { rvShow } from "@/data/rv";
import RvForm from "../../_components/RvForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import { selectBankAccount, selectTypeTrx } from "@/data/select";

type Params = Promise<{ rvId: number }>;

const EditRvPage = async ({ params }: { params: Params }) => {
  const { rvId } = await params;
  const result = await rvShow(rvId);
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

  const [{ data: typeTrxes }, { data: bankAccounts }] = await Promise.all([
    selectTypeTrx("IN"),
    selectBankAccount(),
  ]);

  return (
    <RvForm data={data} bankAccounts={bankAccounts} typeTrxes={typeTrxes} />
  );
};

export default EditRvPage;

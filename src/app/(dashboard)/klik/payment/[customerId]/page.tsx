import { customerShow } from "@/data/customer";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import PaymentForm from "../_components/PaymentForm";

type Params = Promise<{ customerId: number }>;

const PaymentPage = async ({ params }: { params: Params }) => {
  const { customerId } = await params;
  const result = await customerShow(customerId);
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

  return <PaymentForm data={data} />;
};

export default PaymentPage;

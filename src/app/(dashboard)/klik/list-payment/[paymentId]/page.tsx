import { paymentShow } from "@/data/repayment";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import PaymentForm from "../_components/PaymentForm";

type Params = Promise<{ paymentId: number }>;

const ListPaymentPage = async ({ params }: { params: Params }) => {
  const { paymentId } = await params;
  const result = await paymentShow(paymentId);
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

export default ListPaymentPage;

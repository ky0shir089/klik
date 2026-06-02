import { connection } from "next/server";
import InvoiceExternalForm from "../_components/InvoiceExternalForm";
import { selectPaidOffUnit } from "@/data/select";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import Unauthorized from "@/components/unauthorized";

const RenderForm = async ({
  query,
  currentPage,
  size,
  fromDate,
  toDate,
}: {
  query: string;
  currentPage: number;
  size: number;
  fromDate?: string;
  toDate?: string;
}) => {
  await connection();

  if (!fromDate || !toDate) {
    return <InvoiceExternalForm units={[]} countUnit={0} feeAmount={0} />;
  }

  const result = await selectPaidOffUnit(
    currentPage,
    size,
    query,
    fromDate,
    toDate,
  );
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;

  return (
    <InvoiceExternalForm
      units={data.data}
      countUnit={data.total}
      feeAmount={result.fee_amount}
    />
  );
};

const NewInvoiceExternalPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    size?: string;
    from_date?: string;
    to_date?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;
  const fromDate = searchParams?.from_date;
  const toDate = searchParams?.to_date;

  return (
    <RenderForm
      query={query}
      currentPage={currentPage}
      size={size}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
};

export default NewInvoiceExternalPage;

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirect } from "next/navigation";
import { invoiceIndex } from "@/data/invoice";
import FilterListInvoice from "./_components/FilterListInvoice";
import { selectTypeTrx } from "@/data/select";

const RenderTable = async ({
  query,
  typeTrx,
  method,
  currentPage,
  size,
}: {
  query: string;
  typeTrx: string;
  method: string;
  currentPage: number;
  size: number;
}) => {
  const result = await invoiceIndex(currentPage, size, query, typeTrx, method);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: invoices, ...meta } = data;

  return <DataTable columns={columns} data={invoices} meta={meta} />;
};

const InvoicePage = async (props: {
  searchParams?: Promise<{
    q?: string;
    type_trx_id?: string;
    method?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const typeTrx = searchParams?.type_trx_id || "";
  const method = searchParams?.method || "";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  const { data: typeTrxes } = await selectTypeTrx("OUT");

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-3xl font-bold">List Invoice</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SearchBox />
        <FilterListInvoice typeTrxes={typeTrxes} />
      </div>

      <Suspense
        key={`${query}-${typeTrx}-${method}-${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable
          query={query}
          typeTrx={typeTrx}
          method={method}
          currentPage={currentPage}
          size={size}
        />
      </Suspense>
    </>
  );
};

export default InvoicePage;

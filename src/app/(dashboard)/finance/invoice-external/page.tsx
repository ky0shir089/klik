import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { invoiceExternalIndex } from "@/data/invoice-external";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const RenderTable = async ({
  query,
  currentPage,
  size,
}: {
  query: string;
  currentPage: number;
  size: number;
}) => {
  const result = await invoiceExternalIndex(currentPage, size, query);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: invoices, ...meta } = data;

  return <DataTable columns={columns} data={invoices} meta={meta} />;
};

const InvoiceExternalPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-3xl font-bold">List Invoice External</h2>

        <Link href="/finance/invoice-external/new" className={buttonVariants()}>
          New Invoice
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SearchBox />
      </div>

      <Suspense
        key={`${query}-${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable query={query} currentPage={currentPage} size={size} />
      </Suspense>
    </>
  );
};

export default InvoiceExternalPage;

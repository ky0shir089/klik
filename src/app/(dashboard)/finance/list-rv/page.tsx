import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { rvIndex } from "@/data/rv";
import { redirect } from "next/navigation";
import FilterListRv from "./_components/FilterListRv";
import { selectBankAccount, selectTypeTrx } from "@/data/select";

const RenderTable = async ({
  query,
  typeTrx,
  method,
  bank,
  currentPage,
  size,
}: {
  query: string;
  typeTrx: string;
  method: string;
  bank: string;
  currentPage: number;
  size: number;
}) => {
  const result = await rvIndex(currentPage, size, query, typeTrx, method, bank);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: rvs, ...meta } = data;

  return <DataTable columns={columns} data={rvs} meta={meta} />;
};

const RvPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    type_trx_id?: string;
    method?: string;
    bank_account_id?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const typeTrx = searchParams?.type_trx_id || "";
  const method = searchParams?.method || "";
  const bank = searchParams?.bank_account_id || "";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  const { data: typeTrxes } = await selectTypeTrx("IN");
  const { data: banks } = await selectBankAccount();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold">List RV</h2>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SearchBox />
        <FilterListRv typeTrxes={typeTrxes} banks={banks} />
      </div>

      <Suspense
        key={`${query}-${typeTrx}-${method}-${bank}-${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable
          query={query}
          typeTrx={typeTrx}
          method={method}
          bank={bank}
          currentPage={currentPage}
          size={size}
        />
      </Suspense>
    </div>
  );
};

export default RvPage;

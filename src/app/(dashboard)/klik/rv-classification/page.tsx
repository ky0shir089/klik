import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirect } from "next/navigation";
import { customerIndex } from "@/data/customer";
import FilterRv from "./_components/FilterRv";

const RenderTable = async ({
  query,
  currentPage,
  size,
  tab,
}: {
  query: string;
  currentPage: number;
  size: number;
  tab: string;
}) => {
  const result = await customerIndex(currentPage, size, tab, query);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: rvClassifications, ...meta } = data;

  return <DataTable columns={columns} data={rvClassifications} meta={meta} />;
};

const auctionPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    tab: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const tab = searchParams?.tab || "rv";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="mb-4 text-3xl font-bold">Klasifikasi RV</h2>

      <div className="flex items-center gap-2">
        <SearchBox />
        <FilterRv />
      </div>

      <Suspense
        key={`${query}-${currentPage}-${size}-${tab}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable
          query={query}
          currentPage={currentPage}
          size={size}
          tab={tab}
        />
      </Suspense>
    </div>
  );
};

export default auctionPage;

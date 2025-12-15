import Column from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirect } from "next/navigation";
import { sppIndex } from "@/data/spp";

const RenderTable = async ({
  query,
  currentPage,
  size,
}: {
  query: string;
  currentPage: number;
  size: number;
}) => {
  const result = await sppIndex(currentPage, size, query);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: spp, ...meta } = data;

  return <Column data={spp} meta={meta} />;
};

const MemoPaymentPage = async (props: {
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
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Memo SPP</h2>

      <SearchBox />

      <Suspense
        key={`${query}-${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable query={query} currentPage={currentPage} size={size} />
      </Suspense>
    </div>
  );
};

export default MemoPaymentPage;

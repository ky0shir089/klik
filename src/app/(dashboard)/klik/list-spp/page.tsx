import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirect } from "next/navigation";
import { listSpp } from "@/data/spp-v2";
import Columns from "./columns";

const RenderTable = async ({
  page,
  rows,
  query,
}: {
  page: number;
  rows: number;
  query: string;
}) => {
  const result = await listSpp(page, rows, query);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: spps, meta } = data;

  return <Columns data={spps} meta={meta} />;
};

const listSppPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    page?: number;
    rows?: number;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const rows = searchParams?.rows || 10;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="mb-4 text-3xl font-bold">List SPP</h2>

      <SearchBox />

      <Suspense
        key={`${query}-${page}-${rows}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable query={query} page={page} rows={rows} />
      </Suspense>
    </div>
  );
};

export default listSppPage;

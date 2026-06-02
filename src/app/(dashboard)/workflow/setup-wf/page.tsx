import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { workflowIndex } from "@/data/workflow";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderTable = async ({
  query,
  currentPage,
  size,
}: {
  query: string;
  currentPage: number;
  size: number;
}) => {
  const result = await workflowIndex(currentPage, size, query);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: workflows, ...meta } = data;

  return <DataTable columns={columns} data={workflows} meta={meta} />;
};

const workflowPage = async (props: {
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
        <h2 className="mb-4 text-3xl font-bold">Setup Workflow</h2>

        <Link href="/workflow/setup-wf/new" className={buttonVariants()}>
          Add New
        </Link>
      </div>

      <SearchBox />

      <Suspense
        key={`${query}-${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable query={query} currentPage={currentPage} size={size} />
      </Suspense>
    </>
  );
};

export default workflowPage;

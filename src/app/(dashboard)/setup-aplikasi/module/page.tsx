import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { moduleIndex } from "@/data/module";
import { redirect } from "next/navigation";

const ModulePage = async (props: {
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

  const result = await moduleIndex(currentPage, size, query);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const meta = {
    currentPage: data.current_page,
    pageCount: data.last_page,
    totalCount: data.total,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-3xl font-bold">Module</h2>

        <Link href="/setup-aplikasi/module/new" className={buttonVariants()}>
          Add New
        </Link>
      </div>

      <Suspense
        key={query + currentPage + size}
        fallback={<DataTableSkeleton />}
      >
        <SearchBox />
        <DataTable columns={columns} data={data.data} meta={meta} />
      </Suspense>
    </>
  );
};

export default ModulePage;

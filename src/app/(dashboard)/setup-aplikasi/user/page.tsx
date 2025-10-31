import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { userIndex } from "@/data/user";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";

const UserPage = async (props: {
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

  const result = await userIndex(currentPage, size, query);
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
        <h2 className="mb-4 text-3xl font-bold">User</h2>

        <Link href="/setup-aplikasi/user/new" className={buttonVariants()}>
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

export default UserPage;

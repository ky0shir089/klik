import Column from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { selectByad } from "@/data/select";

const RenderTable = async ({
  currentPage,
  size,
}: {
  currentPage: number;
  size: number;
}) => {
  const result = await selectByad(currentPage, size);
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: byads, ...meta } = data;

  return <Column data={byads} meta={meta} />;
};

const ByadPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Pengajuan BYAD</h2>
      </div>

      <Suspense
        key={`$${currentPage}-${size}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable currentPage={currentPage} size={size} />
      </Suspense>
    </div>
  );
};

export default ByadPage;

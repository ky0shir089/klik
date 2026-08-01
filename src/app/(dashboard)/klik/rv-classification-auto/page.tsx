import Column from "./columns";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import Unauthorized from "@/components/unauthorized";
import SearchBox from "@/components/SearchBox";
import { redirectIfUnauthorized } from "@/lib/server-auth";
import { vaAuto } from "@/data/customer";
import VaAutoFilter from "./_components/VaAutoFilter";
import { selectXendit } from "@/data/select";

const RenderTable = async ({
  query,
  currentPage,
  size,
  rvId,
  rvAmount,
  fromDate,
  toDate,
}: {
  query: string;
  currentPage: number;
  size: number;
  rvId: number | string;
  rvAmount: number;
  fromDate: string;
  toDate: string;
}) => {
  const result = await vaAuto({
    currentPage: currentPage, 
    size: size,
    search: query,
    from_date: fromDate,
    to_date: toDate,
  });
  await redirectIfUnauthorized(result);
  if (result.isForbidden) {
    return <Unauthorized />;
  }

  const { data } = result;
  const { data: autos, ...meta } = data;

  return <Column data={autos} meta={meta} rvId={rvId} rvAmount={rvAmount} />;
};

const MemoPaymentPage = async (props: {
  searchParams?: Promise<{
    q?: string;
    rv_id?: number;
    from_date?: string;
    to_date?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const rvId = searchParams?.rv_id || 0;
  const fromDate = searchParams?.from_date || "";
  const toDate = searchParams?.to_date || "";
  const currentPage = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 10;

  const { data } = await selectXendit();
  const rvAmount = Number(
    data.find(
      (item: { id: number | string; ending_balance: number | string }) =>
        String(item.id) === String(rvId),
    )?.ending_balance ?? 0,
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Klasifikasi RV VA Instant</h2>

      <VaAutoFilter xendits={data} />

      <div className="max-w-full">
        <SearchBox />
      </div>

      <Suspense
        key={`${query}-${fromDate}-${toDate}`}
        fallback={<DataTableSkeleton />}
      >
        <RenderTable
          query={query}
          currentPage={currentPage}
          size={size}
          rvId={rvId}
          rvAmount={rvAmount}
          fromDate={fromDate}
          toDate={toDate}
        />
      </Suspense>
    </div>
  );
};

export default MemoPaymentPage;

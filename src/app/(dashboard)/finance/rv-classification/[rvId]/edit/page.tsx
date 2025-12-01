import { rvShow } from "@/data/rv";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import ClassificationForm from "../../_components/ClassificationForm";
import { getBidders, getBiddersType } from "@/data/klik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export interface branchProps {
  id_cabang: string;
  balai_lelang: string;
}

interface PageProps {
  params: Promise<{ rvId: number }>;
  searchParams: Promise<{ date: string; branch_id: number }>;
}

const EditRvPage = async ({ params, searchParams }: PageProps) => {
  const { rvId } = await params;
  const { date, branch_id } = await searchParams;

  const [result, biddersResult] = await Promise.all([
    rvShow(rvId),
    date ? getBidders(date) : Promise.resolve({ data: null }),
  ]);

  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;

  let bidderList: getBiddersType[] = [];
  let listBalaiLelang: branchProps[] = [];

  const { data: bidders } = biddersResult;

  if (bidders) {
    const groupByBalaiLelang = Object.groupBy(
      bidders,
      (item: branchProps) => item.id_cabang
    );
    listBalaiLelang = Object.entries(groupByBalaiLelang)
      .map((item) => ({
        id_cabang: item[0],
        balai_lelang: item[1]![0].balai_lelang,
      }))
      .sort((a, b) => a.balai_lelang.localeCompare(b.balai_lelang));

    bidderList = bidders.filter(
      (item: getBiddersType) => item.id_cabang == branch_id
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-2xl")}>Klasifikasi RV</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>RV No</TableHead>
                <TableCell>{data.rv_no}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableCell>{data.date}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Type Trx</TableHead>
                <TableCell>
                  {data.type_trx.code} - {data.type_trx.name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Keterangan</TableHead>
                <TableCell>{data.description}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Bank</TableHead>
                <TableCell>
                  {data.account.bank.name} - {data.account.account_number} -{" "}
                  {data.account.account_name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>CoA</TableHead>
                <TableCell>
                  {data.account.coa.code} - {data.account.coa.description}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Amount</TableHead>
                <TableCell>
                  {data.ending_balance.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Suspense
        key={date + branch_id}
        fallback={<Loader2 className="animate-spin size-4" />}
      >
        <ClassificationForm
          data={data}
          bidderList={bidderList}
          listBalaiLelang={listBalaiLelang}
        />
      </Suspense>
    </div>
  );
};

export default EditRvPage;

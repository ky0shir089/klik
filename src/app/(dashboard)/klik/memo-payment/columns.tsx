"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState, useTransition } from "react";
import Pagination from "./Pagination";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { sppShowType } from "@/data/spp";
import Link from "next/link";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { paymentStore } from "./action";
import { metaProps } from "@/components/ui/data-table";

interface iAppProps {
  data: sppShowType[];
  meta: metaProps;
}

const Column = ({ data, meta }: iAppProps) => {
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  const updateArray = (arr: number[], id: number, add: boolean) =>
    add ? [...arr, id] : arr.filter((item) => item !== id);

  const pageIds = useMemo(() => data.map((item) => item.id), [data]);

  const isAllSelected = useMemo(
    () =>
      pageIds.length > 0 && pageIds.every((id) => rowSelection.includes(id)),
    [pageIds, rowSelection],
  );

  const handleSelectAll = (checked: boolean) => {
    setRowSelection((prev) =>
      checked
        ? [...prev, ...pageIds.filter((id) => !prev.includes(id))]
        : prev.filter((id) => !pageIds.includes(id)),
    );
  };

  const itemsToSum = useMemo(() => {
    if (rowSelection.length > 0) {
      return data.filter((item) => rowSelection.includes(item.id));
    }
    return [];
  }, [data, rowSelection]);

  const sumTotalUnit = useMemo(
    () => itemsToSum.reduce((acc, item) => acc + Number(item.total_unit), 0),
    [itemsToSum],
  );
  const sumTotalAmount = useMemo(
    () => itemsToSum.reduce((acc, item) => acc + Number(item.total_amount), 0),
    [itemsToSum],
  );

  async function donwloadPdf() {
    startTransition(async () => {
      const values = {
        spps: rowSelection,
      };

      const result = await paymentStore(values);

      if (result.success) {
        toast.success(result.message);
        router.push(`/klik/list-payment/${result.data.id}`);
      } else {
        toast.error(result.message);
      }

      setRowSelection([]);
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead>Balai Lelang</TableHead>
            <TableHead>Total Unit</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={rowSelection.includes(item.id)}
                    onCheckedChange={(checked) =>
                      setRowSelection(
                        updateArray(rowSelection || [], item.id, !!checked),
                      )
                    }
                  />
                </TableCell>
                <TableCell>{item.customer.name}</TableCell>
                <TableCell>{item.branch_name}</TableCell>
                <TableCell>{item.total_unit}</TableCell>
                <TableCell className="text-right">
                  {Number(item.total_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Link
                    className={buttonVariants({ variant: "link", size: "sm" })}
                    href={`/klik/memo-payment/${item.id}`}
                  >
                    <Eye />
                    View
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>{sumTotalUnit}</TableCell>
            <TableCell>{sumTotalAmount.toLocaleString("id-ID")}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      {rowSelection.length > 0 ? (
        <Button
          className="cursor-pointer"
          disabled={isPending}
          onClick={donwloadPdf}
        >
          <LoadingSwap isLoading={isPending}>Pengajuan Pelunasan</LoadingSwap>
        </Button>
      ) : null}

      <Pagination meta={meta} />
    </>
  );
};

export default Column;

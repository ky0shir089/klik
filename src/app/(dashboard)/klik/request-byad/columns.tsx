"use client";

import { Button } from "@/components/ui/button";
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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { sppShowType } from "@/data/spp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { metaProps } from "@/components/ui/data-table";
import Pagination from "./Pagination";
import { byadPaymentStore } from "./action";

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

  async function payByad() {
    startTransition(async () => {
      const values = {
        date: new Date().toISOString().slice(0, 10),
        status: "NEW",
        details: rowSelection,
      };

      const result = await byadPaymentStore(values);

      if (result.success) {
        toast.success(result.message);
        router.push(`/klik/list-byad/${result.data.id}`);
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
            <TableHead>Tanggal</TableHead>
            <TableHead>Balai Lelang</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right">Total Unit</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
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
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.total_unit}</TableCell>
                <TableCell className="text-right">
                  {Number(item.total_amount).toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{sumTotalUnit}</TableCell>
            <TableCell className="text-right">
              {sumTotalAmount.toLocaleString("id-ID")}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      {rowSelection.length > 0 ? (
        <Button
          className="cursor-pointer"
          disabled={isPending}
          onClick={payByad}
        >
          <LoadingSwap isLoading={isPending}>Pengajuan BYAD</LoadingSwap>
        </Button>
      ) : null}

      <Pagination meta={meta} />
    </>
  );
};

export default Column;

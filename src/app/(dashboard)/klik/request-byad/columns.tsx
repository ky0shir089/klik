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
import { useMemo, useState, useTransition, useCallback, memo } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { sppShowType } from "@/data/spp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { metaProps } from "@/components/ui/data-table";
import Pagination from "./Pagination";
import { byadPaymentStore } from "./action";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";

interface iAppProps {
  data: sppShowType[];
  meta: metaProps;
}

const DataRow = memo(
  ({
    item,
    isSelected,
    onToggle,
  }: {
    item: sppShowType;
    isSelected: boolean;
    onToggle: (id: number, checked: boolean) => void;
  }) => (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(item.id, !!checked)}
        />
      </TableCell>
      <TableCell>{item.date}</TableCell>
      <TableCell>{item.branch}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell className="text-right">{item.total_unit}</TableCell>
      <TableCell className="text-right">
        {Number(item.total_amount).toLocaleString("id-ID")}
      </TableCell>
      <TableCell className="text-right">
        {Number(item.byad_amount).toLocaleString("id-ID")}
      </TableCell>
    </TableRow>
  ),
);
DataRow.displayName = "DataRow";

const Column = ({ data, meta }: iAppProps) => {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const handleExpiredSession = useExpiredSessionRedirect();

  const pageIds = useMemo(() => data.map((item) => item.id), [data]);

  const isAllSelected = useMemo(
    () =>
      pageIds.length > 0 && pageIds.every((id) => rowSelection.includes(id)),
    [pageIds, rowSelection],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setRowSelection((prev) =>
        checked
          ? [...prev, ...pageIds.filter((id) => !prev.includes(id))]
          : prev.filter((id) => !pageIds.includes(id)),
      );
    },
    [pageIds],
  );

  const handleToggleRow = useCallback((id: number, checked: boolean) => {
    setRowSelection((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  }, []);

  const { sumTotalUnit, sumTotalAmount, sumByadAmount } = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        if (rowSelection.includes(item.id)) {
          acc.sumTotalUnit += Number(item.total_unit);
          acc.sumTotalAmount += Number(item.total_amount);
          acc.sumByadAmount += Number(item.byad_amount);
        }
        return acc;
      },
      { sumTotalUnit: 0, sumTotalAmount: 0, sumByadAmount: 0 },
    );
  }, [data, rowSelection]);

  async function payByad() {
    startTransition(async () => {
      const values = {
        date: new Date().toISOString().slice(0, 10),
        status: "NEW",
        details: rowSelection,
      };

      const result = await byadPaymentStore(values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        toast.success(result.message);
        router.push(`/klik/list-byad/${result.data.id}`);
        setRowSelection([]);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
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
              <TableHead className="text-right">Byad Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data tersedia.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <DataRow
                  key={item.id}
                  item={item}
                  isSelected={rowSelection.includes(item.id)}
                  onToggle={handleToggleRow}
                />
              ))
            )}
          </TableBody>

          {data.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-semibold text-primary">
                  Total Terpilih
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {sumTotalUnit}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {sumTotalAmount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {sumByadAmount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      <div className="min-h-10">
        {rowSelection.length > 0 && (
          <Button className="w-full" disabled={isPending} onClick={payByad}>
            <LoadingSwap isLoading={isPending}>
              Pengajuan BYAD ({rowSelection.length})
            </LoadingSwap>
          </Button>
        )}
      </div>

      <Pagination meta={meta} />
    </div>
  );
};

export default Column;

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
import {
  memo,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Pagination } from "@/components/pagination";
import type { metaProps } from "@/components/ui/data-table";
import { sppShowType } from "@/data/spp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { vaStore } from "./action";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";

interface iAppProps {
  data: sppShowType[];
  meta: metaProps;
  rvId?: number | string;
  rvAmount?: number;
}

type SelectedSummary = {
  unit: number;
  hargaTotal: number;
  potonganNipl: number;
  biayaAdmin: number;
  hargaSetelahXendit: number;
};

const XENDIT_FEE_PER_REFERENCE = 1560;

const toNumber = (value: number | string | null | undefined) =>
  Number(value) || 0;

const formatIdr = (value: number | string | null | undefined) =>
  toNumber(value).toLocaleString("id-ID");

const createEmptySummary = (): SelectedSummary => ({
  unit: 0,
  hargaTotal: 0,
  potonganNipl: 0,
  biayaAdmin: 0,
  hargaSetelahXendit: 0,
});

const DataRow = memo(function DataRow({
  item,
  isSelected,
  isPending,
  onToggle,
}: {
  item: sppShowType;
  isSelected: boolean;
  isPending: boolean;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <TableRow data-state={isSelected ? "selected" : undefined}>
      <TableCell className="px-3 align-middle">
        <Checkbox
          aria-label={`Pilih ${item.reference_id}`}
          checked={isSelected}
          disabled={isPending}
          onCheckedChange={(checked) =>
            onToggle(item.reference_id, checked === true)
          }
        />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.paid_date}</TableCell>
      <TableCell>{item.reference_id}</TableCell>
      <TableCell className="text-center">{item.total_units}</TableCell>
      <TableCell className="text-right">{formatIdr(item.total_price)}</TableCell>
      <TableCell className="text-right text-destructive">
        {formatIdr(item.total_ticket_price)}
      </TableCell>
      <TableCell className="text-right">
        {formatIdr(item.total_admin_fee)}
      </TableCell>
      <TableCell className="text-right">
        {formatIdr(item.total_final_price)}
      </TableCell>
    </TableRow>
  );
});

const Column = ({ data, meta, rvId, rvAmount = 0 }: iAppProps) => {
  const router = useRouter();

  const [selectedReferenceIds, setSelectedReferenceIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isPending, startTransition] = useTransition();
  const handleExpiredSession = useExpiredSessionRedirect();

  const selectedCount = selectedReferenceIds.size;
  const selectedReferences = useMemo(
    () => Array.from(selectedReferenceIds),
    [selectedReferenceIds],
  );

  // All data IDs for select-all
  const allIds = useMemo(() => data?.map((item) => item.reference_id) ?? [], [data]);

  const isAllSelected = useMemo(
    () =>
      allIds.length > 0 &&
      allIds.every((id) => selectedReferenceIds.has(id)),
    [allIds, selectedReferenceIds],
  );

  const isSomeSelected = useMemo(
    () =>
      !isAllSelected &&
      allIds.some((id) => selectedReferenceIds.has(id)),
    [allIds, selectedReferenceIds, isAllSelected],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedReferenceIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          allIds.forEach((id) => next.add(id));
        } else {
          allIds.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    [allIds],
  );

  const handleToggleRow = useCallback((id: string, checked: boolean) => {
    setSelectedReferenceIds((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }, []);

  const selectedSummary = useMemo(() => {
    if (selectedReferenceIds.size === 0) {
      return createEmptySummary();
    }

    return data.reduce<SelectedSummary>((acc, item) => {
      if (!selectedReferenceIds.has(item.reference_id)) {
        return acc;
      }

      acc.unit += toNumber(item.total_units);
      acc.hargaTotal += toNumber(item.total_price);
      acc.potonganNipl += toNumber(item.total_ticket_price);
      acc.biayaAdmin += toNumber(item.total_admin_fee);
      acc.hargaSetelahXendit += toNumber(item.total_final_price);

      return acc;
    }, createEmptySummary());
  }, [data, selectedReferenceIds]);

  const selectedTotalAmount = Number(
    selectedSummary.hargaSetelahXendit +
      XENDIT_FEE_PER_REFERENCE * selectedCount,
  );
  const isAmountMismatch =
    selectedCount > 0 && selectedTotalAmount !== Number(rvAmount);

  async function submit() {
    startTransition(async () => {
      const values = {
        rv_id: Number(rvId),
        references: selectedReferences,
      };

      const result = await vaStore(values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        setSelectedReferenceIds(new Set());
      } else {
        toast.error(result.message);
      }
    });
  }
  
  return (
    <div className="flex flex-col w-full min-w-0 gap-4">
      <div className="w-full max-w-full overflow-x-auto border rounded-md bg-background">
        <Table className="w-full min-w-[1320px]">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-10 px-3">
                <Checkbox
                  aria-label="Pilih semua data"
                  checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                  disabled={allIds.length === 0 || isPending}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
              </TableHead>
              <TableHead>Bidder</TableHead>
              <TableHead>Tanggal Dibayar</TableHead>
              <TableHead>ID Ref Xendit</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-right">Harga Terbentuk</TableHead>
              <TableHead className="text-right">Potongan NIPL</TableHead>
              <TableHead className="text-right">Biaya Admin</TableHead>
              <TableHead className="text-right">Harga Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((item) => (
                <DataRow
                  key={item.reference_id}
                  item={item}
                  isSelected={selectedReferenceIds.has(item.reference_id)}
                  isPending={isPending}
                  onToggle={handleToggleRow}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total terpilih</TableCell>
              <TableCell className="font-semibold text-center">
                {selectedSummary.unit}
              </TableCell>
              <TableCell className="font-semibold text-right">
                {formatIdr(selectedSummary.hargaTotal)}
              </TableCell>
              <TableCell className="font-semibold text-right text-destructive">
                {formatIdr(selectedSummary.potonganNipl)}
              </TableCell>
              <TableCell className="font-semibold text-right">
                {formatIdr(selectedSummary.biayaAdmin)}
              </TableCell>
              <TableCell className="font-semibold text-right">
                {formatIdr(selectedSummary.hargaSetelahXendit)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Pagination meta={meta} />

      <div className="flex flex-col gap-3 p-4 border rounded-md bg-background sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            Total terpilih ({selectedCount} referensi):{" "}
            <span className="font-semibold text-foreground">
              {formatIdr(selectedTotalAmount)}
            </span>
          </p>

          {isAmountMismatch && (
            <p className="text-xs font-medium text-destructive">
              Total terpilih harus sama dengan RV sebesar {formatIdr(rvAmount)}.
            </p>
          )}
        </div>
        <Button
          className="cursor-pointer sm:min-w-[220px]"
          disabled={selectedCount === 0 || isPending || isAmountMismatch}
          onClick={submit}
        >
          <LoadingSwap isLoading={isPending}>
            {selectedCount > 0
              ? `Selesaikan klasifikasi (${selectedCount})`
              : "Selesaikan klasifikasi"}
          </LoadingSwap>
        </Button>
      </div>
    </div>
  );
};

export default Column;

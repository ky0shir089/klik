"use client";

import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { customerShowType } from "@/data/customer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { selectPaidOffUnit } from "@/data/select";
import { useSearchParams } from "next/navigation";

interface UnitSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
}

type Unit = customerShowType["units"][0];

export const UnitSelector = ({ value, onChange }: UnitSelectorProps) => {
  console.log("UnitSelector Rendered with value:", value);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [selectedUnitsData, setSelectedUnitsData] = useState<Unit[]>(value);
  console.log("Available Units:", selectedUnitsData);

  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setIsSearching(search !== debouncedSearch);
  }, [search, debouncedSearch]);

  useEffect(() => {
    if (!open) return;
    let ignore = false;

    async function fetchUnits() {
      setIsSearching(true);
      try {
        const { data } = await selectPaidOffUnit(
          currentPage,
          size,
          debouncedSearch,
        );
        if (!ignore) {
          setAvailableUnits(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setIsSearching(false);
      }
    }

    fetchUnits();
    return () => {
      ignore = true;
    };
  }, [debouncedSearch, open, currentPage, size]);

  // Keep track of full objects for selected units to persist data across searches/pagination
  useEffect(() => {
    const newSelections = availableUnits?.filter(
      (u) =>
        value.includes(u.id) && !selectedUnitsData.some((s) => s.id === u.id),
    );
    if (newSelections.length > 0) {
      setSelectedUnitsData((prev) => [...prev, ...newSelections]);
    }
  }, [availableUnits, value, selectedUnitsData]);

  const selectedUnits = useMemo(
    () => selectedUnitsData.filter((u) => value?.includes(u.id)),
    [selectedUnitsData, value],
  );

  const handleToggle = (unitId: number) => {
    const newValue = value?.includes(unitId)
      ? value.filter((id) => id !== unitId)
      : [...(value || []), unitId];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    const availableIds = availableUnits.map((u) => u.id);
    const allSelected = availableIds.every((id) => value.includes(id));

    if (allSelected) {
      onChange(value.filter((id) => !availableIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...value, ...availableIds])));
    }
  };

  const selectedCount = value?.length || 0;

  const totals = useMemo(() => {
    return selectedUnits.reduce(
      (acc, u) => ({
        price: acc.price + Number(u.price),
        fee: acc.fee + Number(u.fee_amount),
        ppn: acc.ppn + Number(u.ppn_amount),
        pph: acc.pph + Number(u.pph_amount),
        net: acc.net + Number(u.net_amount),
      }),
      { price: 0, fee: 0, ppn: 0, pph: 0, net: 0 },
    );
  }, [selectedUnits]);

  const UnitTableHeader = ({
    showActions = false,
  }: {
    showActions?: boolean;
  }) => (
    <TableHeader className="sticky top-0 z-10 bg-background">
      <TableRow>
        {!showActions ? (
          <TableHead className="w-12">
            <Checkbox
              checked={
                availableUnits?.length > 0 &&
                availableUnits.every((u) => value.includes(u.id))
              }
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
        ) : null}
        <TableHead>Tanggal</TableHead>
        <TableHead>Nopol</TableHead>
        <TableHead>Nosin</TableHead>
        <TableHead>Nama Bidder</TableHead>
        <TableHead>Cabang</TableHead>
        <TableHead>No Kontrak</TableHead>
        <TableHead className="text-right">Harga Terbentuk</TableHead>
        <TableHead className="text-right">Fee Lelang</TableHead>
        <TableHead className="text-right">PPn</TableHead>
        <TableHead className="text-right">PPh</TableHead>
        <TableHead className="text-right">Netto</TableHead>
        {showActions && <TableHead className="w-[50px]"></TableHead>}
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-2">
              <Plus className="size-4" />
              Pilih Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-full w-full max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Daftar Unit</DialogTitle>
              <DialogDescription>
                Cari dan pilih unit yang tersedia untuk ditambahkan ke invoice.
              </DialogDescription>
            </DialogHeader>

            <div className="relative my-2">
              {isSearching ? (
                <Loader2 className="absolute left-2.5 top-2.5 size-4 animate-spin text-muted-foreground" />
              ) : (
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              )}
              <Input
                placeholder="Cari Nopol atau Cabang..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>

            <div className="flex-1 overflow-auto border rounded-md">
              <Table>
                <UnitTableHeader />
                <TableBody>
                  {availableUnits?.map((unit) => {
                    return (
                      <TableRow
                        key={unit.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            id={`unit-${unit.id}`}
                            checked={value?.includes(unit.id)}
                            onCheckedChange={() => handleToggle(unit.id)}
                          />
                        </TableCell>
                        <TableCell>{unit.auction.auction_date}</TableCell>
                        <TableCell className="font-medium">
                          {unit.police_number}
                        </TableCell>
                        <TableCell>{unit.engine_number}</TableCell>
                        <TableCell>{unit.auction.customer.name}</TableCell>
                        <TableCell>{unit.auction.branch_name}</TableCell>
                        <TableCell>{unit.contract_number}</TableCell>
                        <TableCell className="text-right">
                          {Number(unit.price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(unit.fee_amount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(unit.ppn_amount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(unit.pph_amount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(unit.net_amount).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {availableUnits?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="py-4 text-center text-muted-foreground"
                      >
                        Tidak ada unit ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                {selectedCount} unit terpilih
              </span>
              <Button type="button" onClick={() => setOpen(false)}>
                Selesai
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedUnits.length > 0 && (
        <div className="border rounded-md bg-background">
          <Table>
            <UnitTableHeader showActions />
            <TableBody>
              {selectedUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.auction.auction_date}</TableCell>
                  <TableCell className="font-medium">
                    {unit.police_number}
                  </TableCell>
                  <TableCell>{unit.engine_number}</TableCell>
                  <TableCell>{unit.auction.customer.name}</TableCell>
                  <TableCell>{unit.auction.branch_name}</TableCell>
                  <TableCell>{unit.contract_number}</TableCell>
                  <TableCell className="text-right">
                    {Number(unit.price).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(unit.fee_amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(unit.ppn_amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(unit.pph_amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(unit.net_amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      onClick={() => handleToggle(unit.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/30">
                <TableCell colSpan={6} className="text-right">
                  Total ({selectedCount} Unit)
                </TableCell>
                <TableCell className="text-right">
                  {totals.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {totals.fee.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {totals.ppn.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {totals.pph.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {totals.net.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {selectedCount === 0 && (
        <div className="p-8 text-sm text-center border-2 border-dashed rounded-md text-muted-foreground">
          Belum ada unit yang dipilih. Klik tombol &quot;Pilih Unit&quot; di
          atas.
        </div>
      )}
    </div>
  );
};

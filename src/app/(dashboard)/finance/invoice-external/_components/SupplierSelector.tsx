"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { supplierIndex, supplierShow, supplierShowType } from "@/data/supplier";
import { useDebounce } from "@/hooks/use-debounce";

interface SupplierSelectorProps {
  value?: number | null;
  onSelect: (supplier: supplierShowType) => void;
}

export const SupplierSelector = ({
  value,
  onSelect,
}: SupplierSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierOptions, setSupplierOptions] = useState<supplierShowType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!value) {
      setSelectedName("");
      setSupplierOptions([]);
      return;
    }

    async function fetchSelectedSupplier() {
      try {
        const { data } = await supplierShow(value!);
        setSelectedName(data.name);
        setSupplierOptions([data]);
        onSelect(data);
      } catch (error) {
        console.error("Failed to fetch supplier:", error);
      }
    }

    fetchSelectedSupplier();
  }, [value, onSelect]);

  useEffect(() => {
    if (!open) return;
    if (debouncedSearchQuery.length < 3) {
      setSupplierOptions((prev) =>
        value ? prev.filter((s) => s.id === value) : [],
      );
      return;
    }

    async function fetchSuppliers() {
      setIsLoading(true);
      try {
        const { data } = await supplierIndex(1, 10, debouncedSearchQuery);
        setSupplierOptions(data.data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        setSupplierOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuppliers();
  }, [debouncedSearchQuery, open, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
            )}
            type="button"
          >
            <span className="truncate flex-1 text-left">
              {value ? selectedName : "Pilih Supplier..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Ketik minimal 3 huruf..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : debouncedSearchQuery.length < 3 ? (
              <CommandEmpty>Ketik minimal 3 huruf untuk mencari.</CommandEmpty>
            ) : supplierOptions.length === 0 ? (
              <CommandEmpty>Supplier tidak ditemukan.</CommandEmpty>
            ) : (
              <CommandGroup>
                {supplierOptions.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={String(item.id)}
                    onSelect={() => {
                      onSelect(item);
                      setSelectedName(item.name);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

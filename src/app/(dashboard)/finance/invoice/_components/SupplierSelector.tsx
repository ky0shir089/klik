import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supplierIndex, supplierShowType } from "@/data/supplier";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface SupplierSelectorProps {
  suppliers: supplierShowType[];
  value?: number | null;
  onSelect: (supplier: supplierShowType) => void;
}

export const SupplierSelector = ({
  suppliers,
  value,
  onSelect,
}: SupplierSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierOptions, setSupplierOptions] = useState<supplierShowType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!open) {
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
  }, [debouncedSearchQuery, open]);

  const selectedSupplierName =
    suppliers.find((item) => item.id === value)?.name || "";

  return (
    <div className="flex items-center gap-2">
      <FormControl className="w-full">
        <InputGroup>
          <InputGroupInput
            placeholder="Select Supplier"
            value={selectedSupplierName}
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <InputGroupButton size="icon-xs" className="cursor-pointer">
                  <MoreHorizontal />
                </InputGroupButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Supplier</DialogTitle>
                  <DialogDescription>List of Value.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    placeholder="Search Supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center">
                              <Loader2 className="mx-auto animate-spin" />
                            </TableCell>
                          </TableRow>
                        ) : supplierOptions.length > 0 ? (
                          supplierOptions.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    onSelect(item);
                                    setOpen(false);
                                  }}
                                >
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center">
                              No suppliers found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </InputGroupAddon>
        </InputGroup>
      </FormControl>
    </div>
  );
};

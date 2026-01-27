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
import { rvShowType } from "@/data/rv";
import { selectRv } from "@/data/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface RvSelectorProps {
  rv: rvShowType[];
  value?: number | null;
  onSelect: (rv: rvShowType) => void;
}

export const RvSelector = ({ rv: rvs, value, onSelect }: RvSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rvOptions, setRvOptions] = useState<rvShowType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function fetchSuppliers() {
      setIsLoading(true);
      try {
        const { data } = await selectRv(1, 10, debouncedSearchQuery);
        setRvOptions(data.data);
      } catch (error) {
        console.error("Failed to fetch rvs:", error);
        setRvOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuppliers();
  }, [debouncedSearchQuery, open]);

  const selectedRvName = rvs.find((item) => item.id === value)?.rv_no || "";

  return (
    <div className="flex items-center gap-2">
      <FormControl className="w-full">
        <InputGroup>
          <InputGroupInput
            placeholder="Select RV"
            value={selectedRvName}
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
                  <DialogTitle>Select Rv</DialogTitle>
                  <DialogDescription>List of Value.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    placeholder="Search RV..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>RV No</TableHead>
                          <TableHead>Keterangan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              <Loader2 className="mx-auto animate-spin" />
                            </TableCell>
                          </TableRow>
                        ) : rvOptions.length > 0 ? (
                          rvOptions.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.rv_no}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>
                                {item.ending_balance.toLocaleString("id-ID")}
                              </TableCell>
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
                            <TableCell colSpan={4} className="text-center">
                              No rvs found.
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

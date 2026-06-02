import { Button } from "@/components/ui/button";
import { metaProps } from "@/components/ui/data-table";
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
import Pagination from "./Pagination";
import { useSearchParams } from "next/navigation";

interface RvSelectorProps {
  value?: number | null;
  onSelect: (rv: rvShowType) => void;
}

export const RvSelector = ({ value, onSelect }: RvSelectorProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rvOptions, setRvOptions] = useState<rvShowType[]>([]);
  const [meta, setMeta] = useState({} as metaProps);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function fetchRvs() {
      setIsLoading(true);
      try {
        const result = await selectRv(currentPage, size, debouncedSearchQuery);
        if (result?.data) {
          const { data: rvs, ...meta } = result.data;
          setRvOptions(rvs);
          setMeta(meta);
        }
      } catch (error) {
        console.error("Failed to fetch rvs:", error);
        setRvOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (open || (value && rvOptions.length === 0)) {
      fetchRvs();
    }
  }, [debouncedSearchQuery, open, value, rvOptions.length, currentPage, size]);

  const selectedRvName =
    rvOptions.find((item) => item.id === value)?.rv_no || "";

  return (
    <div className="flex items-center gap-2">
      <FormControl className="w-32">
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
              <DialogContent className="sm:max-w-3xl">
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

                  <div className="-mx-4 max-h-[50vh] overflow-y-auto overflow-x-auto px-4">
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
                                {Number(item.ending_balance).toLocaleString(
                                  "id-ID",
                                )}
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

                    <Pagination meta={meta} />
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

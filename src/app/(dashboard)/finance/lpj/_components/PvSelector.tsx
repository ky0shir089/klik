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
import { pvShowType } from "@/data/pv";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { selectPrepayment } from "@/data/select";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";

interface PvSelectorProps {
  value?: number | null;
  onSelect: (pv: pvShowType) => void;
  disabled?: boolean;
}

export const PvSelector = ({ value, onSelect, disabled }: PvSelectorProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [open, setOpen] = useState(false);
  const [pvOptions, setPvOptions] = useState<pvShowType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleExpiredSession = useExpiredSessionRedirect();

  useEffect(() => {
    async function fetchPvs() {
      setIsLoading(true);
      try {
        const result = await selectPrepayment();
        if (handleExpiredSession(result)) {
          return;
        }

        const { data } = result;
        setPvOptions(data);
      } catch (error) {
        console.error("Failed to fetch pvs:", error);
        setPvOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (open || (value && pvOptions.length === 0)) {
      fetchPvs();
    }
  }, [
    open,
    value,
    currentPage,
    size,
    pvOptions.length,
    handleExpiredSession,
  ]);

  const selectedPvName =
    pvOptions.find((item) => item.prepayment_pv_id === value)?.pv.pv_no || "";

  return (
    <div className="flex items-center gap-2">
      <FormControl className="w-full">
        <InputGroup>
          <InputGroupInput
            placeholder="Select PV"
            value={selectedPvName}
            readOnly
            required
            disabled={disabled}
          />
          <InputGroupAddon align="inline-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <InputGroupButton size="icon-xs" className="cursor-pointer" disabled={disabled}>
                  <MoreHorizontal />
                </InputGroupButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Select PV</DialogTitle>
                  <DialogDescription>List of Value.</DialogDescription>
                </DialogHeader>

                <div className="-mx-4 max-h-[50vh] overflow-y-auto overflow-x-auto px-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PV No</TableHead>
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
                      ) : pvOptions.length > 0 ? (
                        pvOptions.map((item) => (
                          <TableRow key={item.prepayment_pv_id}>
                            <TableCell>{item.pv.pv_no}</TableCell>
                            <TableCell>{item.pv.description}</TableCell>
                            <TableCell>
                              {Number(item.balance).toLocaleString("id-ID")}
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
                            No pvs found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </InputGroupAddon>
        </InputGroup>
      </FormControl>
    </div>
  );
};

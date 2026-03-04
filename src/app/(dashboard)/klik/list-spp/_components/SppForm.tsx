"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerShowType } from "@/data/customer";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { syncStatus } from "../action";
import { File } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  data: Pick<customerShowType, "units"[0]>;
}
interface fileProps {
  id: number;
  file_path: string;
  keterangan: string;
}

const SppForm = ({ data }: iAppProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function onSubmit(status: "approved" | "rejected") {
    const values = {
      spp_id: Number(data.id),
      status: status,
      alasan: status === "rejected" ? reason : "",
      customer_id: data.customer_id,
      branch_name: data.branch_name,
      units: data.units,
    };

    startTransition(async () => {
      const result = await syncStatus(values);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.push("/klik/list-spp");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Lelang</TableHead>
              <TableHead>Balai Lelang</TableHead>
              <TableHead>Nopol</TableHead>
              <TableHead>Noka</TableHead>
              <TableHead>Nosin</TableHead>
              <TableHead>No Kontrak</TableHead>
              <TableHead>No Paket</TableHead>
              <TableHead className="text-right">Harga Lelang</TableHead>
              <TableHead className="text-right">Potongan Tiket</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Harga Distribusi</TableHead>
              <TableHead className="text-right">Selisih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.units.map((item: customerShowType["units"][number]) => (
              <TableRow key={item.id}>
                <TableCell>{item?.auction.auction_date}</TableCell>
                <TableCell>{item?.auction.branch_name}</TableCell>
                <TableCell>{item.police_number}</TableCell>
                <TableCell>{item.chassis_number}</TableCell>
                <TableCell>{item.engine_number}</TableCell>
                <TableCell>{item.contract_number}</TableCell>
                <TableCell>{item.package_number}</TableCell>
                <TableCell className="text-right">
                  {item.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.ticket_price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.admin_fee.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.final_price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.distributed_price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.diff_price.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="text-right">
                {data.sum_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {data.sum_ticket_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {data.sum_admin_fee.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {data.sum_final_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {data.sum_distributed_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {data.sum_diff_price.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex justify-start gap-4">
        {data.files.map((file: fileProps) => (
          <div
            key={file.id}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Link
              href={`https://api.devlmu.com/kliklelang/images/service/image/${file.file_path}`}
              target="_blank"
            >
              <File className="size-12" />
            </Link>
            <span className="text-sm">{file.keterangan}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              Reject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reject SPP</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this SPP.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => onSubmit("rejected")}
                disabled={isPending}
                className="cursor-pointer"
              >
                <LoadingSwap isLoading={isPending}>Confirm Reject</LoadingSwap>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          type="submit"
          className="bg-green-400 cursor-pointer"
          onClick={() => onSubmit("approved")}
          disabled={isPending}
        >
          <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
        </Button>
      </div>
    </div>
  );
};

export default SppForm;

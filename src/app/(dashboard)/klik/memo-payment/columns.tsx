"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useTransition } from "react";
import Pagination from "./Pagination";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { sppShowType } from "@/data/spp";
import Link from "next/link";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { paymentStore } from "./action";

export interface metaProps {
  current_page: number;
  from: number;
  last_page: number;
  next_page_url: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

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

  async function donwloadPdf() {
    startTransition(async () => {
      const values = {
        spps: rowSelection,
      };

      const result = await paymentStore(values);
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        router.push(`/klik/list-payment/${result.data.id}`);
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
            <TableHead></TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead>Balai Lelang</TableHead>
            <TableHead>Total Unit</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Action</TableHead>
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
                        updateArray(rowSelection || [], item.id, !!checked)
                      )
                    }
                  />
                </TableCell>
                <TableCell>{item.customer.name}</TableCell>
                <TableCell>{item.branch_name}</TableCell>
                <TableCell>{item.total_unit}</TableCell>
                <TableCell>
                  {Number(item.total_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Link
                    className={buttonVariants({ variant: "link", size: "sm" })}
                    href={`/klik/memo-payment/${item.id}`}
                  >
                    <Eye />
                    View
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {rowSelection.length > 0 ? (
        <Button
          className="cursor-pointer"
          disabled={isPending}
          onClick={donwloadPdf}
        >
          <LoadingSwap isLoading={isPending}>Pengajuan Pelunasan</LoadingSwap>
        </Button>
      ) : null}

      <Pagination meta={meta} />
    </>
  );
};

export default Column;

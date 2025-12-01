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
import { paymentShowType } from "@/data/repayment";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import Pagination from "./Pagination";
// import { pdf, sppStore } from "../action";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";

interface iAppProps {
  data: paymentShowType[];
  meta: {
    currentPage: number;
    from: number;
    lastPage: number;
    nextPageUrl: string;
    perPage: number;
    prevPageUrl: string;
    to: number;
    totalCount: number;
  };
}

const Column = ({ data, meta }: iAppProps) => {
  const [rowSelection, setRowSelection] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  const updateArray = (arr: number[], id: number, add: boolean) =>
    add ? [...arr, id] : arr.filter((item) => item !== id);

  async function donwloadPdf() {
    startTransition(async () => {
      // const values = {
      //   id: rowSelection,
      // };
      // const result = await sppStore(values);

      // if (result.success) {
      //   toast.success(result.message);
      // } else {
      //   toast.error(result.message);
      // }

      // setRowSelection([]);
      // try {
      //   const file = await pdf(rowSelection);

      //   const url = URL.createObjectURL(file);
      //   const a = document.createElement("a");
      //   a.href = url;
      //   a.download = `Memo_Pelunasan_${new Date().toString()}`;
      //   a.click();
      //   URL.revokeObjectURL(url);
      // } catch (error) {
      //   console.error("Download error:", error);
      //   alert("Error downloading file.");
      // }
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Balai Lelang</TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead>Total Unit</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={rowSelection.includes(item.id)}
                  onCheckedChange={(checked) => {
                    if (item.status !== "NEW")
                      return alert("SPP sudah diajukan");

                    setRowSelection(
                      updateArray(rowSelection || [], item.id, !!checked)
                    );
                  }}
                />
              </TableCell>
              <TableCell>
                {new Date(item.payment_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {item.branch_id} - {item.branch_name}
              </TableCell>
              <TableCell>{item.customer.name}</TableCell>
              <TableCell>{item.total_unit}</TableCell>
              <TableCell>{item.total_amount.toLocaleString("id-ID")}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Link
                  className={buttonVariants({ variant: "link", size: "sm" })}
                  href={`/klik/list-payment/${item.id}`}
                >
                  <Eye />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {rowSelection.length > 0 ? (
        <Button
          className="cursor-pointer"
          disabled={isPending}
          onClick={donwloadPdf}
        >
          <LoadingSwap isLoading={isPending}>Buat Memo Pelunasan</LoadingSwap>
        </Button>
      ) : null}

      <Pagination meta={meta} />
    </>
  );
};

export default Column;

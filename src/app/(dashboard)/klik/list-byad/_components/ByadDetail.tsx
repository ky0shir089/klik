"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { byadPaymentShowType } from "@/data/byad-payment";
import { paymentShowType } from "@/data/repayment";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { byadAttachment } from "../action";
import { memo } from "@/app/(dashboard)/finance/list-invoice/_components/action";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

interface iAppProps {
  data: paymentShowType;
}

const ByadDetail = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();

  async function downloadMemo() {
    startTransition(async () => {
      const file = await memo(data.invoice_id);
      downloadFile(file, "Memo_BYAD.pdf");
    });
  }

  async function downloadAttachment() {
    startTransition(async () => {
      const file = await byadAttachment(data.id);
      downloadFile(file, "Lampiran_BYAD.xlsx");
    });
  }

  return (
    <>
      <CardContent className={cn("space-y-8")}>
        {data.details.map((item: byadPaymentShowType) => (
          <Table key={item.id}>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Total unit</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>BYAD Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>{item.byad.date}</TableCell>
                <TableCell>{item.byad.branch}</TableCell>
                <TableCell>{item.byad.total_unit}</TableCell>
                <TableCell>
                  {item.byad.total_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  {item.byad.byad_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.byad.status}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={5}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Tgl Lelang</TableHead>
                        <TableHead>Nama Bidder</TableHead>
                        <TableHead>Nopol</TableHead>
                        <TableHead>Noka</TableHead>
                        <TableHead>Nosin</TableHead>
                        <TableHead className="text-right">
                          Harga Lelang
                        </TableHead>
                        <TableHead className="text-right">Nilai BYAD</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {item.byad.details.map(
                        (
                          sub: Pick<byadPaymentShowType, "byad"[0]>,
                          index: number,
                        ) => (
                          <TableRow key={sub.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {sub.unit.auction.auction_date}
                            </TableCell>
                            <TableCell>
                              {sub.unit.auction.customer.name}
                            </TableCell>
                            <TableCell>{sub.unit.police_number}</TableCell>
                            <TableCell>{sub.unit.chassis_number}</TableCell>
                            <TableCell>{sub.unit.engine_number}</TableCell>
                            <TableCell className="text-right">
                              {sub.unit.price.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              {sub.unit.byad_amount.toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ))}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-4">
        <Button
          className="w-full bg-teal-500 cursor-pointer hover:bg-teal-600"
          disabled={isPending}
          onClick={downloadMemo}
        >
          <LoadingSwap isLoading={isPending}>Cetak Memo</LoadingSwap>
        </Button>

        <Button
          className="w-full cursor-pointer"
          disabled={isPending}
          onClick={downloadAttachment}
        >
          <LoadingSwap isLoading={isPending}>Download Lampiran</LoadingSwap>
        </Button>
      </CardFooter>
    </>
  );
};

export default ByadDetail;

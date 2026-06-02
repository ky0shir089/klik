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
import { byadPdf } from "../action";

interface iAppProps {
  data: paymentShowType;
}

const ByadDetail = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();

  async function downloadPdf() {
    startTransition(async () => {
      try {
        const file = await byadPdf(data.id);

        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Lampiran_BYAD.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        alert("Error downloading file.");
      }
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

      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={isPending}
          onClick={downloadPdf}
        >
          <LoadingSwap isLoading={isPending}>Download Lampiran</LoadingSwap>
        </Button>
      </CardFooter>
    </>
  );
};

export default ByadDetail;

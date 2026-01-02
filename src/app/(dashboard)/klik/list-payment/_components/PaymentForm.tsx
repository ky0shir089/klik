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
import { paymentShowType } from "@/data/repayment";
import { cn } from "@/lib/utils";
import React, { useTransition } from "react";
import { pdf } from "../action";

interface iAppProps {
  data: paymentShowType;
}

const PaymentForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();

  async function donwloadPdf() {
    startTransition(async () => {
      try {
        const file = await pdf(data.id);

        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Memo_Pelunasan_${data.spp_no.replaceAll("/", "_")}.pdf`;
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
        {data.spps.map((item: Pick<paymentShowType, "spps"[0]>) => (
          <Table key={item.id}>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Total unit</TableHead>
                <TableHead>Total Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>{item.spp.customer.name}</TableCell>
                <TableCell>{item.spp.branch_name}</TableCell>
                <TableCell>{item.spp.total_unit}</TableCell>
                <TableCell>
                  {item.spp.total_amount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={4}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Tgl Lelang</TableHead>
                        <TableHead>Nopol</TableHead>
                        <TableHead>Noka</TableHead>
                        <TableHead>Nosin</TableHead>
                        <TableHead>No Kontrak</TableHead>
                        <TableHead>No Paket</TableHead>
                        <TableHead className="text-right">
                          Harga Lelang
                        </TableHead>
                        <TableHead className="text-right">
                          Potongan Tiket
                        </TableHead>
                        <TableHead className="text-right">Fee</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {item.spp.details.map(
                        (
                          sub: Pick<paymentShowType, "spps"[0]>,
                          index: number
                        ) => (
                          <TableRow key={sub.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {sub.unit.auction.auction_date}
                            </TableCell>
                            <TableCell>{sub.unit.police_number}</TableCell>
                            <TableCell>{sub.unit.chassis_number}</TableCell>
                            <TableCell>{sub.unit.engine_number}</TableCell>
                            <TableCell>{sub.unit.contract_number}</TableCell>
                            <TableCell>{sub.unit.package_number}</TableCell>
                            <TableCell className="text-right">
                              {sub.unit.price.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              {sub.unit.ticket_price.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              {sub.unit.admin_fee.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              {sub.unit.final_price.toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        )
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
          onClick={donwloadPdf}
        >
          <LoadingSwap isLoading={isPending}>
            Download Memo Pelunasan
          </LoadingSwap>
        </Button>
      </CardFooter>
    </>
  );
};

export default PaymentForm;

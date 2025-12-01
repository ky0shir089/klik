"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paymentShowType } from "@/data/repayment";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
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
        a.download = `Memo_Pelunasan_${data.customer.name}`;
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableCell>{data.payment_date}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>KTP Bidder</TableHead>
                <TableCell>{data.customer.ktp}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Nama Bidder</TableHead>
                <TableCell>{data.customer.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Status</TableHead>
                <TableCell>{data.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RV No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rvs.map((item: Pick<paymentShowType, "rv"[0]>) => (
                <TableRow key={item.id}>
                  <TableCell>{item.rv.rv_no}</TableCell>
                  <TableCell>{item.rv.date}</TableCell>
                  <TableCell>{item.rv.description}</TableCell>
                  <TableCell className="text-right">
                    {item.rv_amount.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">
                  {data.rvs
                    .reduce(
                      (acc: number, item: Pick<paymentShowType, "rv"[0]>) =>
                        acc + item.rv_amount,
                      0
                    )
                    .toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Lelang</TableHead>
              <TableHead>Balai Lelang</TableHead>
              <TableHead>No Lot</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Nopol</TableHead>
              <TableHead>Noka</TableHead>
              <TableHead>Nosin</TableHead>
              <TableHead>No Kontrak</TableHead>
              <TableHead>No Paket</TableHead>
              <TableHead className="text-right">Harga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.units.map((item: Pick<paymentShowType, "unit"[0]>) => (
              <TableRow key={item.id}>
                <TableCell>{item.unit.auction.auction_date}</TableCell>
                <TableCell>{item.unit.auction.branch_name}</TableCell>
                <TableCell>{item.unit.lot_number}</TableCell>
                <TableCell>{item.unit.auction.auction_name}</TableCell>
                <TableCell>{item.unit.police_number}</TableCell>
                <TableCell>{item.unit.chassis_number}</TableCell>
                <TableCell>{item.unit.engine_number}</TableCell>
                <TableCell>{item.unit.contract_number}</TableCell>
                <TableCell>{item.unit.package_number}</TableCell>
                <TableCell className="text-right">
                  {item.unit.final_price.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9}>Total</TableCell>
              <TableCell className="text-right">
                {data.total_amount.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={isPending}
          onClick={donwloadPdf}
        >
          <LoadingSwap isLoading={isPending}>Download Memo Pelunasan</LoadingSwap>
        </Button>
      </CardFooter>
    </>
  );
};

export default PaymentForm;

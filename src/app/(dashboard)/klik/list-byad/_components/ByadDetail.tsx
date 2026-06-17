"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <Accordion type="multiple" className="w-full">
          {data.details.map((item: byadPaymentShowType) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="grid w-full grid-cols-2 gap-4 text-left sm:grid-cols-3 lg:grid-cols-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Date</span>
                    <span>{item.byad.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Cabang</span>
                    <span>{item.byad.branch}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Total unit</span>
                    <span>{item.byad.total_unit}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Total Amount</span>
                    <span>{item.byad.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">BYAD Amount</span>
                    <span>{item.byad.byad_amount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Status</span>
                    <span>{item.byad.status}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Tgl Lelang</TableHead>
                      <TableHead>Nama Bidder</TableHead>
                      <TableHead>Nopol</TableHead>
                      <TableHead>Noka</TableHead>
                      <TableHead>Nosin</TableHead>
                      <TableHead className="text-right">Harga Lelang</TableHead>
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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

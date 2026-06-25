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
import { paymentShowType } from "@/data/repayment";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { pdf, sppAttachment } from "../action";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

interface iAppProps {
  data: paymentShowType;
}

const PaymentForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();

  async function downloadPdf() {
    startTransition(async () => {
      const file = await pdf(data.id);
      downloadFile(
        file,
        `Memo_Pelunasan_${data.spp_no.replaceAll("/", "_")}.pdf`,
      );
    });
  }

  async function downloadAttachment() {
    startTransition(async () => {
      const file = await sppAttachment(data.id);
      downloadFile(file, "Lampiran_SPP.xlsx");
    });
  }

  return (
    <>
      <CardContent className={cn("space-y-8")}>
        <Accordion type="multiple" className="w-full">
          {data.spps.map((item: Pick<paymentShowType, "spps"[0]>) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="grid w-full grid-cols-2 gap-4 text-left sm:grid-cols-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Bidder
                    </span>
                    <span>{item.spp.customer.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Cabang
                    </span>
                    <span>{item.spp.branch_name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Total unit
                    </span>
                    <span>{item.spp.total_unit}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Total Amount
                    </span>
                    <span>{item.spp.total_amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 border-t">
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
                      <TableHead className="text-right">Harga Lelang</TableHead>
                      <TableHead className="text-right">
                        Potongan Tiket
                      </TableHead>
                      <TableHead className="text-right">Titipan Fee</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {item.spp.details.map(
                      (
                        sub: Pick<paymentShowType, "spps"[0]>,
                        index: number,
                      ) => (
                        <TableRow key={sub.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{sub.unit.auction.auction_date}</TableCell>
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
          onClick={downloadPdf}
        >
          <LoadingSwap isLoading={isPending}>
            Download Memo Pelunasan
          </LoadingSwap>
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

export default PaymentForm;

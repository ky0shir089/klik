"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerShowType } from "@/data/customer";
import { invoiceShowType } from "@/data/invoice";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { memo } from "../action";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

const InvoiceExternalData = ({ data }: invoiceShowType) => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();

  async function downloadMemo() {
    startTransition(async () => {
      const file = await memo(data.id);
      downloadFile(
        file,
        `Invoice_External_${data.invoice_external_no.replaceAll("/", "_")}.pdf`,
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
          Invoice External Detail
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableCell>{data.date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Tanggal Jatuh Tempo</TableHead>
                  <TableCell>{data.due_date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableCell>{data.invoice_external_no}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableCell>{data.supplier.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Keterangan</TableHead>
                  <TableCell>{data.description}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Total Unit</TableHead>
                  <TableCell>{data.total_unit}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Amount Real</TableHead>
                  <TableCell>
                    {Number(data.total_amount_real).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>

                {data.total_amount_manual > 0 ? (
                  <TableRow>
                    <TableHead>Amount Tagihan</TableHead>
                    <TableCell>
                      {Number(data.total_amount_manual).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ) : null}

                <TableRow>
                  <TableHead>Penandatangan</TableHead>
                  <TableCell>{data.signatory}</TableCell>
                </TableRow>

                {data.attachment ? (
                  <TableRow>
                    <TableHead>Attachment</TableHead>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Paperclip className="size-4" />
                        <Link
                          href={`${env.NEXT_PUBLIC_BASE_URL}/storage/${data.attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {data.attachment.filename}
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}

                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableCell>{data.status}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="w-full overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nopol</TableHead>
                  <TableHead>Nosin</TableHead>
                  <TableHead>Nama Bidder</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>No Kontrak</TableHead>
                  <TableHead className="text-right">Harga Terbentuk</TableHead>
                  <TableHead className="text-right">Fee Lelang</TableHead>
                  <TableHead className="text-right">PPn</TableHead>
                  <TableHead className="text-right">PPh</TableHead>
                  <TableHead className="text-right">Netto</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.units.map(
                  (item: customerShowType["units"][0], index: number) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.unit.auction.auction_date}</TableCell>
                      <TableCell className="font-medium">
                        {item.unit.police_number}
                      </TableCell>
                      <TableCell>{item.unit.engine_number}</TableCell>
                      <TableCell>{item.unit.auction.customer.name}</TableCell>
                      <TableCell>{item.unit.auction.branch_name}</TableCell>
                      <TableCell>{item.unit.contract_number}</TableCell>
                      <TableCell className="text-right">
                        {Number(item.unit.price).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.unit.fee_amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.unit.ppn_amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.unit.pph_amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.unit.net_amount).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full mt-6 bg-teal-500 cursor-pointer hover:bg-teal-600"
          disabled={isPending}
          onClick={downloadMemo}
        >
          <LoadingSwap isLoading={isPending}>Cetak Memo</LoadingSwap>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceExternalData;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoiceShowType } from "@/data/invoice";
import { env } from "@/lib/env";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import { TimelineTracker } from "./TimelineTracker";

const InvoiceData = ({ data }: invoiceShowType) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableCell>{data.date}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableCell>{data.invoice_no}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Type Trx</TableHead>
              <TableCell>{data.type_trx.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableCell>{data.supplier_account.supplier.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Cara Bayar</TableHead>
              <TableCell>{data.payment_method}</TableCell>
            </TableRow>

            {data.payment_method === "BANK" ? (
              <>
                <TableRow>
                  <TableHead>Nama Rekening</TableHead>
                  <TableCell>
                    {data.supplier_account.account_name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>Nomor Rekening</TableHead>
                  <TableCell>
                    {data.supplier_account.bank.name} -{" "}
                    {data.supplier_account.account_number}
                  </TableCell>
                </TableRow>
              </>
            ) : null}

            <TableRow>
              <TableHead>Keterangan</TableHead>
              <TableCell>{data.description}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Amount</TableHead>
              <TableCell>
                {Number(data.total_amount).toLocaleString("id-ID")}
              </TableCell>
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

            {data.payment_method == "PREPAYMENT" ? (
              <TableRow>
                <TableHead>PV No</TableHead>
                <TableCell>
                  {data.settlement?.pv.pv_no} -{" "}
                  {data.settlement?.pv.pv_amount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>

        {data.wf_histories.length > 0 && (
          <TimelineTracker items={data.wf_histories} />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>CoA</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Item Amount</TableHead>
            <TableHead>PPH</TableHead>
            <TableHead>% Rate</TableHead>
            <TableHead>PPH Amount</TableHead>
            <TableHead>% PPN</TableHead>
            <TableHead>PPN Amount</TableHead>
            <TableHead>No Reff</TableHead>
            <TableHead>Total Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.details.map(
            (item: invoiceShowType["details"][0], index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.coa.code}</TableCell>
                <TableCell>{item.coa.description}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  {Number(item.item_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.pph?.name ?? "-"}</TableCell>
                <TableCell className="text-center">
                  {item.pph?.rate ?? 0}
                </TableCell>
                <TableCell className="text-right">
                  {Number(item.pph_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-center">{item.ppn_rate}</TableCell>
                <TableCell className="text-right">
                  {Number(item.ppn_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  {item.rv
                    ? `${item.rv?.rv_no} - ${Number(item.rv?.ending_balance).toLocaleString("id-ID")}`
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {Number(item.total_amount).toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceData;

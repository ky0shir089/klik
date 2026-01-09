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
import Link from "next/link";

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
              <TableCell>{data.trx_dtl.trx.name}</TableCell>
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
              <TableRow>
                <TableHead>Nomor Rekening</TableHead>
                <TableCell>
                  {data?.supplier_account.bank.name} -{" "}
                  {data?.supplier_account.account_number}
                </TableCell>
              </TableRow>
            ) : null}

            <TableRow>
              <TableHead>Keterangan</TableHead>
              <TableCell>{data.description}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Amount</TableHead>
              <TableCell>{data.total_amount.toLocaleString("id-ID")}</TableCell>
            </TableRow>

            {data.attachment ? (
              <TableRow>
                <TableHead>Attachment</TableHead>
                <TableCell>
                  <Link
                    href={`${env.NEXT_PUBLIC_BASE_URL}/storage/${data.attachment.path}`}
                    target="_blank"
                  >
                    {data.attachment.filename}
                  </Link>
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
            (item: Pick<invoiceShowType, "details"[0]>, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.coa.code}</TableCell>
                <TableCell>{item.coa.description}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  {item.item_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.pph?.name ?? "-"}</TableCell>
                <TableCell>{item.pph?.rate ?? 0}</TableCell>
                <TableCell className="text-right">
                  {item.pph_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.ppn_rate}</TableCell>
                <TableCell className="text-right">
                  {item.ppn_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.rv?.rv_no ?? "-"}</TableCell>
                <TableCell className="text-right">
                  {item.total_amount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceData;

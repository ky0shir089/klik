import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { invoiceShowType } from "@/data/invoice";

const InvoiceData = ({ data }: invoiceShowType) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableCell>
            {new Date(data.created_at).toLocaleDateString()}
          </TableCell>
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
          <TableHead>Nomor Rekening</TableHead>
          <TableCell>
            {data.supplier_account.bank.name} -{" "}
            {data.supplier_account.account_number}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>CoA</TableHead>
          <TableCell>
            {data.coa.code} - {data.coa.description}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Keterangan</TableHead>
          <TableCell>{data.description}</TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Amount</TableHead>
          <TableCell>{data.amount.toLocaleString("id-ID")}</TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Status</TableHead>
          <TableCell>{data.status}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default InvoiceData;

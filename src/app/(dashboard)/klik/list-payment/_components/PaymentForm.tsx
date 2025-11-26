import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface iAppProps {
  data: paymentShowType;
}

const PaymentForm = ({ data }: iAppProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Payment Detail</CardTitle>
      </CardHeader>

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
                <TableCell>{item.unit.auction.auction_name}</TableCell>
                <TableCell>{item.unit.lot_number}</TableCell>
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
    </Card>
  );
};

export default PaymentForm;

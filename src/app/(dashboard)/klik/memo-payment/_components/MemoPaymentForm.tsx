"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sppShowType } from "@/data/spp";

interface iAppProps {
  data: sppShowType;
}

const MemoPaymentForm = ({ data }: iAppProps) => {
  const { sumBasePrice, sumFee, sumFinalPrice } = data.details.reduce(
    (
      acc: { sumBasePrice: number; sumFee: number; sumFinalPrice: number },
      detail: Pick<sppShowType, "details"[0]>
    ) => ({
      sumBasePrice: acc.sumBasePrice + detail.unit.price,
      sumFee: acc.sumFee + detail.unit.admin_fee,
      sumFinalPrice: acc.sumFinalPrice + detail.unit.final_price,
    }),
    { sumBasePrice: 0, sumFee: 0, sumFinalPrice: 0 }
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl">Data Customer</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>KTP Bidder</TableHead>
              <TableHead>Nama Bidder</TableHead>
              <TableHead>VA Bidder</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>
                {new Date(data.created_at).toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>{data.customer.ktp}</TableCell>
              <TableCell>{data.customer.name}</TableCell>
              <TableCell>{data.customer.va_number}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-xl">Data Unit</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Lelang</TableHead>
              <TableHead>Balai Lelang</TableHead>
              <TableHead>Nopol</TableHead>
              <TableHead>Noka</TableHead>
              <TableHead>Nosin</TableHead>
              <TableHead>No Kontrak</TableHead>
              <TableHead>No Paket</TableHead>
              <TableHead className="text-right">Harga Lelang</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.details || []).map(
              (item: Pick<sppShowType, "details"[0]>) => (
                <TableRow key={item.id}>
                  <TableCell>{item.unit.auction.auction_date}</TableCell>
                  <TableCell>{item.unit.auction.branch_name}</TableCell>
                  <TableCell>{item.unit.police_number}</TableCell>
                  <TableCell>{item.unit.chassis_number}</TableCell>
                  <TableCell>{item.unit.engine_number}</TableCell>
                  <TableCell>{item.unit.contract_number}</TableCell>
                  <TableCell>{item.unit.package_number}</TableCell>
                  <TableCell className="text-right">
                    {item.unit.price.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.unit.admin_fee.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.unit.final_price.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="text-right">
                {sumBasePrice.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {sumFee.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {sumFinalPrice.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default MemoPaymentForm;

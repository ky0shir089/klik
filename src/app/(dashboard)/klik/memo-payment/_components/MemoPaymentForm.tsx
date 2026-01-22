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
import { memo, useMemo } from "react";

interface MemoPaymentFormProps {
  data: sppShowType;
}

type UnitSums = {
  sumBasePrice: number;
  sumTicketPrice: number;
  sumFee: number;
  sumFinalPrice: number;
  sumDistributed: number;
  sumDiff: number;
};

const CustomerTable = memo(function CustomerTable({
  customer,
  createdAt,
}: {
  customer: sppShowType["customer"];
  createdAt?: string;
}) {
  return (
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
            <TableCell>{createdAt?.split("T")[0]}</TableCell>
            <TableCell>{customer.ktp}</TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.va_number}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});
CustomerTable.displayName = "CustomerTable";

const UnitTable = memo(function UnitTable({
  details,
  sums,
}: {
  details: sppShowType["details"];
  sums: UnitSums;
}) {
  return (
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
            <TableHead className="text-right">Potongan Tiket</TableHead>
            <TableHead className="text-right">Fee</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Harga Distribusi</TableHead>
            <TableHead className="text-right">Selisih</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(details || []).map((item: sppShowType["details"]) => (
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
                {item.unit.ticket_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {item.unit.admin_fee.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {item.unit.final_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {item.unit.distributed_price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                {item.unit.diff_price.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell className="text-right">
              {sums.sumBasePrice.toLocaleString("id-ID")}
            </TableCell>
            <TableCell className="text-right">
              {sums.sumTicketPrice.toLocaleString("id-ID")}
            </TableCell>
            <TableCell className="text-right">
              {sums.sumFee.toLocaleString("id-ID")}
            </TableCell>
            <TableCell className="text-right">
              {sums.sumFinalPrice.toLocaleString("id-ID")}
            </TableCell>
            <TableCell className="text-right">
              {sums.sumDistributed.toLocaleString("id-ID")}
            </TableCell>
            <TableCell className="text-right">
              {sums.sumDiff.toLocaleString("id-ID")}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
});
UnitTable.displayName = "UnitTable";

const MemoPaymentForm = ({ data }: MemoPaymentFormProps) => {
  const sums = useMemo<UnitSums>(() => {
    const initialSums: UnitSums = {
      sumBasePrice: 0,
      sumTicketPrice: 0,
      sumFee: 0,
      sumFinalPrice: 0,
      sumDistributed: 0,
      sumDiff: 0,
    };

    if (!data.details) {
      return initialSums;
    }

    return data.details.reduce(
      (acc: UnitSums, detail: sppShowType["details"]) => ({
        sumBasePrice: acc.sumBasePrice + detail.unit.price,
        sumTicketPrice: acc.sumTicketPrice + detail.unit.ticket_price,
        sumFee: acc.sumFee + detail.unit.admin_fee,
        sumFinalPrice: acc.sumFinalPrice + detail.unit.final_price,
        sumDistributed: acc.sumDistributed + detail.unit.distributed_price,
        sumDiff: acc.sumDiff + detail.unit.diff_price,
      }),
      initialSums,
    );
  }, [data.details]);

  return (
    <div className="flex flex-col gap-8">
      <CustomerTable customer={data.customer} createdAt={data.created_at} />
      <UnitTable details={data.details} sums={sums} />
    </div>
  );
};

export default MemoPaymentForm;

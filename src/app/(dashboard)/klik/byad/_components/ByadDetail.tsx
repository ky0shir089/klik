import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { byadShowType } from "@/data/byad";
import { customerShowType } from "@/data/customer";
import { env } from "@/lib/env";
import { Paperclip } from "lucide-react";
import Link from "next/link";

const ByadDetail = ({ data }: byadShowType) => {
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
              <TableHead>Cabang</TableHead>
              <TableCell>{data.branch}</TableCell>
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
              <TableHead>Total Amount</TableHead>
              <TableCell>{data.total_amount.toLocaleString("id-ID")}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Byad Amount</TableHead>
              <TableCell>{data.byad_amount.toLocaleString("id-ID")}</TableCell>
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
          {data.details.map(
            (item: Pick<customerShowType, "units"[0]>, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.unit.auction.auction_date}</TableCell>
                <TableCell>{item.unit.auction.customer.name}</TableCell>
                <TableCell>{item.unit.police_number}</TableCell>
                <TableCell>{item.unit.chassis_number}</TableCell>
                <TableCell>{item.unit.engine_number}</TableCell>
                <TableCell className="text-right">
                  {item.unit.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {item.unit.byad_amount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ByadDetail;

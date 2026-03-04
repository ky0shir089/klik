import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SppPaginationMeta } from "./_components/Pagination";
import { listSppType } from "@/data/spp-v2";
import { Eye } from "lucide-react";
import Link from "next/link";
import Pagination from "./_components/Pagination";

interface iAppProps {
  data: listSppType[];
  meta: SppPaginationMeta;
}

const Columns = ({ data, meta }: iAppProps) => {
  return (
    <>
      <div className="overflow-hidden border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bidder</TableHead>
              <TableHead>Nama Cabang</TableHead>
              <TableHead>Nomor Paket</TableHead>
              <TableHead className="text-right">Total Unit</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nama_bidder}</TableCell>
                  <TableCell>{item.nama_cabang}</TableCell>
                  <TableCell>{item.nomor_paket}</TableCell>
                  <TableCell className="text-right">{item.total_unit}</TableCell>
                  <TableCell className="text-right">
                    {Number(item.total_harga_spp).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Link
                      className={buttonVariants({ variant: "link", size: "sm" })}
                      href={`/klik/list-spp/${item.id}`}
                    >
                      <Eye />
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination meta={meta} />
    </>
  );
};

export default Columns;

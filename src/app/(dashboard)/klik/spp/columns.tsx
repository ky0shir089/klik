"use client";

import { buttonVariants } from "@/components/ui/button";
import { customerShowType } from "@/data/customer";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<customerShowType>[] = [
  {
    header: "Bidder",
    accessorKey: "name",
  },
  {
    header: "VA Number",
    accessorKey: "va_number",
  },
  {
    header: "Unit",
    accessorKey: "units_count",
    cell: ({ row }) => (
      <div className="text-center">{row.original.units_count}</div>
    ),
  },
  {
    header: () => <div className="text-center">Harga Terbentuk</div>,
    accessorKey: "units_sum_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Biaya Admin",
    accessorKey: "units_sum_admin_fee",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_admin_fee).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Harga Total",
    accessorKey: "units_sum_final_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_final_price).toLocaleString("id-ID")}
      </div>
    ),
  },
   {
    header: "Selisih",
    accessorKey: "units_sum_diff_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_diff_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/klik/spp/${row.original.klik_bidder_id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

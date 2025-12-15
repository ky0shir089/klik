"use client";

import { buttonVariants } from "@/components/ui/button";
import { customerShowType } from "@/data/customer";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
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
    accessorKey: "auctions_count",
    cell: ({ row }) => (
      <div className="text-center">{row.original.auctions_count}</div>
    ),
  },
  {
    header: "Harga Dasar",
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
    header: "Harga Terbentuk",
    accessorKey: "units_sum_final_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_final_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/klik/rv-classification/${row.original.klik_bidder_id}`}
      >
        <ClipboardEdit />
        Klasifikasi
      </Link>
    ),
  },
];

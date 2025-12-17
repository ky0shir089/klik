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
    header: () => <div className="text-center">Unit</div>,
    accessorKey: "auctions_count",
    cell: ({ row }) => (
      <div className="text-center">{row.original.auctions_count}</div>
    ),
  },
  {
    header: () => <div className="text-right">Harga Terbentuk</div>,
    accessorKey: "units_sum_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Biaya Admin</div>,
    accessorKey: "units_sum_admin_fee",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_admin_fee).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Harga Total</div>,
    accessorKey: "units_sum_final_price",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.units_sum_final_price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Action",
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

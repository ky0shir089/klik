"use client";

import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ByadType {
  id: string;
  date: string;
  total_unit: number;
  total_amount: number;
  status: string;
}

export const columns: ColumnDef<ByadType>[] = [
  {
    header: "Payment Date",
    accessorKey: "date",
    cell: ({ row }) => row.original.date,
  },
  {
    header: "Total Unit",
    accessorKey: "total_unit",
  },
  {
    header: () => <div className="text-right">Total Amount</div>,
    accessorKey: "total_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.total_amount.toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/klik/list-byad/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

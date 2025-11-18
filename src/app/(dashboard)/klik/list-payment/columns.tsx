"use client";

import { buttonVariants } from "@/components/ui/button";
import { paymentShowType } from "@/data/repayment";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<paymentShowType>[] = [
  {
    header: "Payment Date",
    accessorKey: "payment_date",
    cell: ({ row }) => new Date(row.original.payment_date).toLocaleDateString(),
  },
  {
    header: "Balai Lelang",
    accessorFn: (row) => `${row.branch_id} - ${row.branch_name}`,
  },
  {
    header: "Bidder",
    accessorFn: (row) => row.customer.name,
  },
  {
    header: "Total Unit",
    accessorKey: "total_unit",
  },
  {
    header: "Total Amount",
    accessorKey: "total_amount",
    cell: ({ row }) => row.original.total_amount.toLocaleString("id-ID"),
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
        href={`/klik/list-payment/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

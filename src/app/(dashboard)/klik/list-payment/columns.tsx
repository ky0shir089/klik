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
    cell: ({ row }) => row.original.payment_date,
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

"use client";

import { buttonVariants } from "@/components/ui/button";
import { rvShowType } from "@/data/rv";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<rvShowType>[] = [
  {
    header: "RV No",
    accessorKey: "rv_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
  },
  {
    header: "Type Trx",
    accessorFn: (row) => row.type_trx?.name,
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Metode Pembayaran",
    accessorKey: "pay_method",
  },
  {
    header: "Journal Number",
    accessorKey: "journal_number",
    cell: ({ row }) => row.original?.journal_number,
  },
  {
    header: "Bank",
    accessorFn: (row) =>
      row.account
        ? `${row.account?.bank.name} - ${row.account?.account_number}`
        : null,
  },
  {
    header: "Amount",
    accessorKey: "starting_balance",
    cell: ({ row }) => row.original.starting_balance.toLocaleString("id-ID"),
  },
  {
    header: "Balance",
    cell: ({ row }) => row.original.ending_balance.toLocaleString("id-ID"),
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ({ row }) =>
      row.original.status === "NEW" &&
      row.original.customer_id !== null && (
        <Link
          className={buttonVariants({ variant: "link", size: "sm" })}
          href={`/finance/list-rv/${row.original.id}/edit`}
        >
          <Eye />
          View
        </Link>
      ),
  },
];

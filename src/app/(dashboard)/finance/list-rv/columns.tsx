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
    header: "Bank",
    accessorFn: (row) =>
      `${row.account.bank.name} - ${row.account?.account_number}`,
  },
  {
    header: "Amount",
    accessorKey: "starting_balance",
    cell: ({ row }) => row.original.starting_balance.toLocaleString("id-ID"),
  },
  {
    header: "Balance",
    cell: ({ row }) =>
      (
        row.original.ending_balance - row.original.used_rv_sum_total_amount
      ).toLocaleString("id-ID"),
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

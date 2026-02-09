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
    cell: ({ row }) => row.original.date.split(" ")[0],
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
  },
  {
    header: "Bank",
    accessorFn: (row) =>
      row.account
        ? `${row.account?.bank.name} - ${row.account?.account_number}`
        : null,
  },
  {
    header: () => <div className="text-right">Amount</div>,
    accessorKey: "starting_balance",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.starting_balance).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Balance</div>,
    accessorKey: "ending_balance",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.ending_balance).toLocaleString("id-ID")}
      </div>
    ),
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

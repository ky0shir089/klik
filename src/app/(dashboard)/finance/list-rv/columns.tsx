"use client";

import { rvShowType } from "@/data/rv";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "ending_balance",
    cell: ({ row }) => row.original.ending_balance.toLocaleString("id-ID"),
  },
  {
    header: "Used Amount",
    accessorKey: "used_rv_sum_total_amount",
    cell: ({ row }) =>
      row.original.used_rv_sum_total_amount?.toLocaleString("id-ID"),
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
];

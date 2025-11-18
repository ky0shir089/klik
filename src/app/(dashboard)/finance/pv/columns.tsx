"use client";

import { pvShowType } from "@/data/pv";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<pvShowType>[] = [
  {
    header: "Balai Lelang",
    accessorFn: (row) => `${row.branch_id} - ${row.branch_name}`,
  },
  {
    header: "Bidder",
    accessorFn: (row) => row.customer.name,
  },
  {
    header: "Supplier",
    accessorFn: (row) => `${row.supplier.id} - ${row.supplier.name}`,
  },
  {
    header: "Bank",
    accessorFn: (row) => row.bank.name,
  },
  {
    header: "Nomor Rekening",
    accessorFn: (row) => row.bank_account.account_number,
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
];

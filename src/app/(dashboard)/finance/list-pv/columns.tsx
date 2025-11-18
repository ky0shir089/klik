"use client";

import { pvShowType } from "@/data/pv";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<pvShowType>[] = [
  {
    header: "PV No",
    accessorKey: "pv_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => new Date(row.original.paid_date).toLocaleDateString(),
  },
  {
    header: "Keterangan",
    accessorKey: "description",
  },
  {
    header: "Bank",
    accessorFn: (row) =>
      `${row.bank_account.bank.name} - ${row.bank_account.account_number}`,
  },
  {
    header: "Paid To",
    accessorFn: (row) => row.supplier.name,
  },
  {
    header: "Rekening",
    accessorFn: (row) =>
      `${row.supplier_account.bank.name} - ${row.supplier_account.account_number}`,
  },
  {
    header: "Amount",
    accessorKey: "pv_amount",
    cell: ({ row }) => row.original.pv_amount.toLocaleString("id-ID"),
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

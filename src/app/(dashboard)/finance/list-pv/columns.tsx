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
    cell: ({ row }) => row.original.paid_date,
  },
  {
    header: "Keterangan",
    accessorKey: "description",
  },
  {
    header: "Cara Bayar",
    accessorKey: "payment_method",
  },
  {
    header: "Bank",
    accessorKey: "bank_account",
    cell: ({ row }) =>
      row.original.bank_account
        ? `${row.original.bank_account?.bank.name} - ${row.original.bank_account?.account_number}`
        : null,
  },
  {
    header: "Paid To",
    accessorFn: (row) => row.supplier.name,
  },
  {
    header: "Rekening",
    accessorKey: "supplier_account",
    cell: ({ row }) =>
      row.original.supplier_account
        ? `${row.original.supplier_account?.bank.name} - ${row.original.supplier_account?.account_number}`
        : null,
  },
  {
    header: () => "Amount",
    accessorKey: "pv_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.pv_amount).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

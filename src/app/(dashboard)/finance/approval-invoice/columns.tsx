"use client";

import { buttonVariants } from "@/components/ui/button";
import { invoiceShowType } from "@/data/invoice";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<invoiceShowType>[] = [
  {
    header: "Invoice No",
    accessorKey: "invoice_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => row.original.date,
  },
  {
    header: "Type Trx",
    accessorKey: "trx_id",
    cell: ({ row }) => row.original.trx_dtl.trx.name,
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Supplier",
    accessorFn: (row) => row.supplier_account.supplier.name,
  },
  {
    header: "Payment Method",
    accessorKey: "payment_method",
  },
  {
    header: "Bank",
    accessorFn: (row) =>
      `${row.supplier_account?.bank.name} - ${row.supplier_account?.account_number}`,
  },
  {
    header: "Amount",
    accessorKey: "amount",
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
        href={`/finance/approval-invoice/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

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
    cell: ({ row }) => row.original.type_trx.name,
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
      row.payment_method === "BANK"
        ? `${row.supplier_account.bank.name} - ${row.supplier_account?.account_number}`
        : null,
  },
  {
    header: () => <div className="text-right">Amount</div>,
    accessorKey: "amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.total_amount).toLocaleString("id-ID")}
      </div>
    ),
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
        href={`/finance/list-invoice/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

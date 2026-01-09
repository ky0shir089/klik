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
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
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
    header: "Bank",
    accessorFn: (row) =>
      `${row.supplier_account.bank.name} - ${row.supplier_account?.account_number}`,
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
        href={`/finance/list-invoice/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

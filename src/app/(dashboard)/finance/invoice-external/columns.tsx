"use client";

import { buttonVariants } from "@/components/ui/button";
import { invoiceShowType } from "@/data/invoice";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<invoiceShowType>[] = [
  {
    header: "Invoice External No",
    accessorKey: "invoice_external_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => row.original.date,
  },
  {
    header: "Jatuh Tempo",
    accessorKey: "due_date",
    cell: ({ row }) => row.original.due_date,
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Supplier",
    accessorFn: (row) => row.supplier.name,
  },
  {
    header: () => <div className="text-center">Unit</div>,
    accessorKey: "total_unit",
    cell: ({ row }) => (
      <div className="text-center">{row.original.total_unit}</div>
    ),
  },
  {
    header: () => <div className="text-right">Amount</div>,
    accessorKey: "total_amount",
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
        href={`/finance/invoice-external/${row.original.id}`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

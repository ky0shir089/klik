"use client";

import { buttonVariants } from "@/components/ui/button";
import { invoiceShowType } from "@/data/invoice";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<invoiceShowType>[] = [
  {
    header: "PV No",
    accessorFn: (row) => row.pv.pv_no,
  },
  {
    header: "Tanggal",
    accessorFn: (row) => row.pv.paid_date,
  },
  {
    header: "Description",
    accessorFn: (row) => row.pv.description,
  },
  {
    header: "Supplier",
    accessorFn: (row) => row.pv.supplier.name,
  },
  {
    header: "Bank",
    accessorFn: (row) =>
      `${row.pv.supplier_account.bank.name} - ${row.pv.supplier.name}`,
  },
  {
    header: () => <div className="text-right">Prepayment Amount</div>,
    accessorKey: "prepayment_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.prepayment_amount).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">LPJ Amount</div>,
    accessorKey: "lpj_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.lpj_amount).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Balance</div>,
    accessorKey: "balance",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.balance).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Status",
    accessorFn: (row) => row.status,
  },
  {
    header: "Action",
    cell: ({ row }) =>
      row.original.invoice.status != "REQUEST" ? (
        <Link
          className={buttonVariants({ variant: "link", size: "sm" })}
          href={`/finance/list-invoice/${row.original.lpj_invoice_id}`}
        >
          <Eye />
          View
        </Link>
      ) : (
        <Link
          className={buttonVariants({ variant: "link", size: "sm" })}
          href={`/finance/lpj/${row.original.id}`}
        >
          <Eye />
          View
        </Link>
      ),
  },
];

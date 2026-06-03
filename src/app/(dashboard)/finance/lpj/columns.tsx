"use client";

import { buttonVariants } from "@/components/ui/button";
import { invoiceShowType } from "@/data/invoice";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<invoiceShowType>[] = [
  {
    header: "PV No",
    accessorFn: (row) => row.pv.pv_no,
    cell: ({ row }) => (
      <Link
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "underline hover:text-blue-500",
        })}
        href={`/finance/list-invoice/${row.original.pv.processable_id}`}
      >
        {row.original.pv.pv_no}
      </Link>
    ),
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
    header: "Invoice No",
    accessorFn: (row) => row.invoice?.invoice_no,
    cell: ({ row }) =>
      row.original.invoice?.status === "REQUEST" &&
      row.original.invoice?.wf_approval?.approve_count === 0 ? (
        <Link
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "underline hover:text-blue-500",
          })}
          href={`/finance/lpj/${row.original?.id}`}
        >
          {row.original.invoice?.invoice_no}
        </Link>
      ) : (
        <Link
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "underline hover:text-blue-500",
          })}
          href={`/finance/list-invoice/${row.original?.invoice.id}`}
        >
          {row.original.invoice?.invoice_no}
        </Link>
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
    header: "PV Kekurangan",
    accessorFn: (row) => row.byhmd?.pv?.pv_no,
    cell: ({ row }) => (
      <Link
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "underline hover:text-blue-500",
        })}
        href={`/finance/list-invoice/${row.original?.byhmd_invoice_id}`}
      >
        {row.original.byhmd?.pv?.pv_no}
      </Link>
    ),
  },
  {
    header: () => <div className="text-right">Kekurangan</div>,
    accessorKey: "byhmd_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.byhmd_amount).toLocaleString("id-ID")}
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
];

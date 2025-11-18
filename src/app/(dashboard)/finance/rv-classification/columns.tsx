"use client";

import { buttonVariants } from "@/components/ui/button";
import { rvShowType } from "@/data/rv";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

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
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/finance/rv-classification/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Klasifikasi
      </Link>
    ),
  },
];

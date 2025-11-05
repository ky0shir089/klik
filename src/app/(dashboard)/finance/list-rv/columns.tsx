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
    cell: ({ row }) =>
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(row.original.date)),
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
    accessorKey: "starting_balance",
    cell: ({ row }) => row.original.starting_balance.toLocaleString("id-ID"),
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
        href={`/finance/list-rv/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Klasifikasi
      </Link>
    ),
  },
];

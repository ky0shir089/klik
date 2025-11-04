"use client";

import { buttonVariants } from "@/components/ui/button";
import { bankAccountShowType } from "@/data/bank-account";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<bankAccountShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nomor Rekening",
    accessorKey: "account_number",
  },
  {
    header: "Nama Rekening",
    accessorKey: "account_name",
  },
  {
    header: "Bank",
    accessorFn: (row) => row.bank?.name,
  },
  {
    header: "CoA",
    accessorFn: (row) => row.coa?.code,
  },
  {
    header: "Status",
    accessorKey: "is_active",
    cell: ({ getValue }) => (getValue() ? "ACTIVE" : "INACTIVE"),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/accounting/bank-account/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

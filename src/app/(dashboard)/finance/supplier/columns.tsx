"use client";

import { buttonVariants } from "@/components/ui/button";
import { supplierShowType } from "@/data/supplier";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<supplierShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Bank",
    accessorFn: (row) => row.account.bank.name,
  },
  {
    header: "Nomor Rekening",
    accessorFn: (row) => row.account.account_number,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/finance/supplier/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

"use client";

import { buttonVariants } from "@/components/ui/button";
import { trxDtlShowType } from "@/data/trx-dtl";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<trxDtlShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Trx Code",
    accessorFn: (row) => row.trx.code,
  },
  {
    header: "Trx Name",
    accessorFn: (row) => row.trx.name,
  },
  {
    header: "CoA Code",
    accessorFn: (row) => row.coa.code,
  },
  {
    header: "CoA Name",
    accessorFn: (row) => row.coa.description,
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
        href={`/accounting/trx-detail/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

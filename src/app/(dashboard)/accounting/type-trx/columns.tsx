"use client";

import { buttonVariants } from "@/components/ui/button";
import { typeTrxShowType } from "@/data/type-trx";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<typeTrxShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "name",
    accessorKey: "name",
  },
  {
    header: "Type",
    accessorKey: "in_out",
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
        href={`/accounting/type-trx/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

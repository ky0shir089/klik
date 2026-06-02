"use client";

import { buttonVariants } from "@/components/ui/button";
import { workflowShowType } from "@/data/workflow";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<workflowShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Min Amount",
    accessorKey: "min_amount",
    cell: ({ getValue }) => (getValue() as number).toLocaleString("id-ID"),
  },
  {
    header: "Max Amount",
    accessorKey: "max_amount",
    cell: ({ getValue }) =>
      (getValue() as number) > 0
        ? (getValue() as number).toLocaleString("id-ID")
        : "No Limit",
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
        href={`/workflow/setup-wf/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

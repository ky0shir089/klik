"use client";

import { buttonVariants } from "@/components/ui/button";
import { pphShowType } from "@/data/pph";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<pphShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Rate",
    accessorKey: "rate",
    cell: ({ row }) => <div>{row.original.rate} %</div>,
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
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/accounting/pph/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

"use client";

import { buttonVariants } from "@/components/ui/button";
import { coaShowType } from "@/data/coa";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<coaShowType>[] = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "type",
    accessorKey: "type",
  },
  {
    header: "Parent",
    accessorFn: (row) => row.parent?.code,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/accounting/chart-of-account/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

"use client";

import { buttonVariants } from "@/components/ui/button";
import { journalShowType } from "@/data/journal-input";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/dist/client/link";

export const columns: ColumnDef<journalShowType>[] = [
  {
    header: "GL No",
    accessorKey: "gl_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
  },
  {
    header: "Keterangan",
    accessorKey: "description",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/accounting/journal-input/${row.original.gl_no}/edit`}
      >
        <Eye />
        View
      </Link>
    ),
  },
];

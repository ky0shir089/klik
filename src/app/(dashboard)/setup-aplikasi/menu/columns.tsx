"use client";

import { buttonVariants } from "@/components/ui/button";
import { menuShowType } from "@/data/menu";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<menuShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Module",
    accessorKey: "module.name",
  },
  {
    header: "Title",
    accessorKey: "name",
  },
  {
    header: "URL",
    accessorKey: "url",
  },
  {
    header: "Position",
    accessorKey: "position",
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
        href={`/setup-aplikasi/menu/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

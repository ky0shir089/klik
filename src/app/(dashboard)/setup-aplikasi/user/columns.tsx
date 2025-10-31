"use client";

import { buttonVariants } from "@/components/ui/button";
import { userShowType } from "@/data/user";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<userShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "User ID",
    accessorKey: "user_id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Role",
    accessorKey: "role.name",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/setup-aplikasi/user/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

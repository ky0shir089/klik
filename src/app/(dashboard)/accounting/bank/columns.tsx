"use client";

import { buttonVariants } from "@/components/ui/button";
import { bankShowType } from "@/data/bank";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";
import { getImage } from "@/lib/get-image";
import Image from "next/image";

export const columns: ColumnDef<bankShowType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Bank Name",
    accessorKey: "name",
  },
  {
    header: "Logo",
    cell: ({ row }) => (
      <Image
        alt="logo"
        src={getImage(row.original.logo)}
        width={0}
        height={0}
        sizes="100vw"
        className="w-16 h-auto object-contain"
      />
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/accounting/bank/${row.original.id}/edit`}
      >
        <ClipboardEdit />
        Edit
      </Link>
    ),
  },
];

"use client";

import { buttonVariants } from "@/components/ui/button";
import { customerShowType } from "@/data/customer";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<customerShowType>[] = [
  {
    header: "ID",
    accessorKey: "klik_bidder_id",
  },
  {
    header: "KTP",
    accessorKey: "ktp",
  },
  {
    header: "Bidder",
    accessorKey: "name",
  },
  {
    header: "Balai Lelang",
    accessorKey: "auctions",
    cell: ({ row }) => {
      const auctions = row.original.auctions;
      const groupAuction = Object.groupBy(
        auctions,
        (item: { branch_name: string }) => item.branch_name
      );

      return (
        <div className="flex flex-col gap-2">
          {Object.keys(groupAuction).map((key: string) => (
            <span key={key}>{key}</span>
          ))}
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/klik/payment/${row.original.klik_bidder_id}`}
      >
        <ClipboardEdit />
        Pelunasan
      </Link>
    ),
  },
];

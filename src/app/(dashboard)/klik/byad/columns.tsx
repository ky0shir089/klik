"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { byadShowType } from "@/data/byad";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { byadDelete } from "./action";
import { toast } from "sonner";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter } from "next/navigation";

const ActionCell = ({ row }: { row: Row<byadShowType> }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleReject = () => {
    startTransition(async () => {
      try {
        const response = await byadDelete(row.original.id);
        if (response.success) {
          toast.success("Byad rejected successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to reject byad");
        }
      } catch (error) {
        console.error("Error deleting byad:", error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2 sm:flex-row">
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/klik/byad/${row.original.id}`}
      >
        <Eye />
        View
      </Link>

      {row.original.status !== "PAID" && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="cursor-pointer"
          onClick={handleReject}
          disabled={isPending}
        >
          <LoadingSwap isLoading={isPending}>Reject</LoadingSwap>
        </Button>
      )}
    </div>
  );
};

export const columns: ColumnDef<byadShowType>[] = [
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => row.original.date,
  },
  {
    header: "Balai Lelang",
    accessorKey: "branch",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: () => <div className="text-right">Total Unit</div>,
    accessorKey: "total_unit",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.total_unit).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Total Amount</div>,
    accessorKey: "total_amount",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.total_amount).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ActionCell,
  },
];

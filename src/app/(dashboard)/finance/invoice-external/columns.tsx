"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { invoiceShowType } from "@/data/invoice";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { invoiceExternalReject } from "./action";

const ActionCell = ({ row }: { row: Row<invoiceShowType> }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();

  const handleReject = () => {
    startTransition(async () => {
      try {
        const response = await invoiceExternalReject(row.original.id);
        if (handleExpiredSession(response)) {
          return;
        }

        if (response.success) {
          toast.success("Rejected successfully");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to reject invoice");
        }
      } catch (error) {
        console.error("Error rejecting invoice:", error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2 sm:flex-row">
      <Link
        className={buttonVariants({ variant: "link", size: "sm" })}
        href={`/finance/invoice-external/${row.original.id}`}
      >
        <Eye />
        View
      </Link>

      {row.original.status !== "CLOSE" && (
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

export const columns: ColumnDef<invoiceShowType>[] = [
  {
    header: "Invoice External No",
    accessorKey: "invoice_external_no",
  },
  {
    header: "Tanggal",
    accessorKey: "date",
    cell: ({ row }) => row.original.date,
  },
  {
    header: "Jatuh Tempo",
    accessorKey: "due_date",
    cell: ({ row }) => row.original.due_date,
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Supplier",
    accessorFn: (row) => row.supplier.name,
  },
  {
    header: () => <div className="text-center">Unit</div>,
    accessorKey: "total_unit",
    cell: ({ row }) => (
      <div className="text-center">{row.original.total_unit}</div>
    ),
  },
  {
    header: () => <div className="text-right">Amount Real</div>,
    accessorKey: "total_amount_real",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.total_amount_real).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Amount Tagihan</div>,
    accessorKey: "total_amount_manual",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.original.total_amount_manual).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    header: "Penandatangan",
    accessorKey: "signatory",
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

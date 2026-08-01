"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { invoiceStatusSchemaType } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { memo, statusUpdate } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { invoiceShowType } from "@/data/invoice";
import InvoiceData from "@/components/InvoiceData";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";
import { sppShowType } from "@/data/spp";
import Link from "next/link";
import UploadAttachment from "./UploadAttachment";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  CheckCircle2,
  Paperclip,
  ReceiptText,
} from "lucide-react";

interface iAppProps {
  data: invoiceShowType;
  spp?: sppShowType;
}

const InvoiceAction = ({ data, spp }: iAppProps) => {
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();
  const downloadFile = useAuthenticatedFileDownload();

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();

  async function downloadMemo() {
    startTransition(async () => {
      const file = await memo(data.id);
      downloadFile(
        file,
        `Memo_Invoice_${data.invoice_no.replaceAll("/", "_")}.pdf`,
      );
    });
  }

  function onSubmit(status: string) {
    const values = {
      ...data,
      wf_history_id: null,
      status,
    };

    startTransition(async () => {
      const result = await statusUpdate(data.id, values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/list-invoice");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Invoice Detail</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {spp ? (
          <Link
            href={`/klik/list-payment/${spp.id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-teal-300 hover:bg-teal-50/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <div className="flex items-center min-w-0 gap-3">
              <div className="flex items-center justify-center transition bg-white rounded-full shadow-xs size-10 shrink-0 text-slate-600 group-hover:text-teal-700">
                <ReceiptText className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Related payment
                </p>
                <p className="text-sm font-semibold truncate text-slate-900">
                  Lihat detail pelunasan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-teal-700 shrink-0">
              Open
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ) : null}

        <InvoiceData data={data} />

        {data.status === "PAID" ? (
          <div className="relative p-4 overflow-hidden border border-teal-200 shadow-sm rounded-xl bg-linear-to-br from-teal-50 via-white to-emerald-50">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-teal-500" />
            <div className="flex items-start justify-between gap-3 pl-2 mb-4">
              <div className="flex gap-3">
                <div className="flex items-center justify-center text-teal-700 bg-teal-100 rounded-full size-10 shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-teal-950">
                      Invoice sudah dibayar
                    </p>
                    <Paperclip className="text-teal-700 size-4" />
                  </div>
                  <p className="text-sm text-teal-900/70">
                    Upload bukti pembayaran agar dokumen paid lengkap.
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-teal-700 border-teal-300 bg-white/80"
              >
                PAID
              </Badge>
            </div>

            <div className="pl-2">
              <UploadAttachment invoice_id={data.id} />
            </div>
          </div>
        ) : null}

        {data.status !== "PAID" ? (
          <Button
            className="w-full bg-teal-500 cursor-pointer hover:bg-teal-600"
            disabled={isPending}
            onClick={downloadMemo}
          >
            <LoadingSwap isLoading={isPending}>Cetak Memo</LoadingSwap>
          </Button>
        ) : null}
      </CardContent>

      {data.status === "APPROVE" ? (
        <CardFooter className={cn("flex gap-2")}>
          <Button
            type="submit"
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={() => onSubmit("CANCEL")}
          >
            <LoadingSwap isLoading={isPending}>Cancel</LoadingSwap>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default InvoiceAction;

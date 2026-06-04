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
import { memo, statusUpdate } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { invoiceShowType } from "@/data/invoice";
import InvoiceData from "@/components/InvoiceData";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

interface iAppProps {
  data: invoiceShowType;
}

const InvoiceAction = ({ data }: iAppProps) => {
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

      <CardContent>
        <InvoiceData data={data} />

        <Button
          className="w-full mt-6 bg-teal-500 cursor-pointer hover:bg-teal-600"
          disabled={isPending}
          onClick={downloadMemo}
        >
          <LoadingSwap isLoading={isPending}>Cetak Memo</LoadingSwap>
        </Button>
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

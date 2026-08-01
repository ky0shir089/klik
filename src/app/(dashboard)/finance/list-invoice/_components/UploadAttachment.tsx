"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import {
  paidAttachmentSchema,
  paidAttachmentSchemaType,
} from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { attachmentUpload } from "../action";

const MAX_FILE_SIZE = 1024 * 1024;

function formatFileSize(size: number) {
  return `${Math.max(1, Math.round(size / 1024)).toLocaleString("id-ID")} KB`;
}

export default function UploadAttachment({ invoice_id }: { invoice_id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm<paidAttachmentSchemaType>({
    resolver: zodResolver(paidAttachmentSchema),
    defaultValues: {
      invoice_id: invoice_id,
      attachment: null,
    },
  });

  const selectedAttachment = useWatch({
    control: form.control,
    name: "attachment",
  });
  const hasFileError = Boolean(form.formState.errors.attachment);

  function clearFileInput() {
    setFileInputKey((key) => key + 1);
  }

  function resetAttachment() {
    form.setValue("attachment", null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.clearErrors("attachment");
    clearFileInput();
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      resetAttachment();
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      form.setValue("attachment", null, { shouldDirty: true });
      form.setError("attachment", {
        type: "manual",
        message: "PDF format only.",
      });
      clearFileInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      form.setValue("attachment", null, { shouldDirty: true });
      form.setError("attachment", {
        type: "manual",
        message: "Max file size 1MB.",
      });
      clearFileInput();
      return;
    }

    form.clearErrors("attachment");
    form.setValue("attachment", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function onSubmit(values: paidAttachmentSchemaType) {
    if (!values.attachment) {
      form.setError("attachment", {
        type: "manual",
        message: "Select payment proof PDF first.",
      });
      return;
    }

    startTransition(async () => {
      const result = await attachmentUpload(values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        form.reset({
          invoice_id,
          attachment: null,
        });
        clearFileInput();
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  key={fileInputKey}
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="peer sr-only"
                  disabled={isPending}
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </FormControl>
              <FormLabel
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-teal-300 bg-white/80 p-4 transition hover:border-teal-500 hover:bg-white peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
                  isPending && "cursor-not-allowed opacity-70",
                  hasFileError && "border-destructive/70 bg-destructive/5",
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <UploadCloud className="size-5" />
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="block text-sm font-semibold text-teal-950">
                    {field.value
                      ? "Ganti bukti pembayaran"
                      : "Pilih bukti pembayaran"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    PDF saja, maksimal 1MB. Klik area ini untuk browse file.
                  </span>
                </span>
              </FormLabel>

              {field.value ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-teal-200 bg-white px-3 py-2 shadow-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileCheck2 className="size-4 shrink-0 text-teal-600" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-teal-950">
                        {field.value.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(field.value.size)} siap upload
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={isPending}
                    onClick={resetAttachment}
                    aria-label="Remove selected attachment"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : null}

              <FormDescription>
                Upload bukti final setelah status invoice PAID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-teal-600 cursor-pointer hover:bg-teal-700"
          disabled={isPending || !selectedAttachment || hasFileError}
        >
          <LoadingSwap isLoading={isPending}>Upload bukti bayar</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

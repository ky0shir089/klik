"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  invoiceExternalSchema,
  invoiceExternalSchemaType,
} from "@/lib/formSchema";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Paperclip } from "lucide-react";
import { invoiceShowType } from "@/data/invoice";
import { memo } from "../../list-invoice/_components/action";
import Link from "next/link";
import { env } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierShowType } from "@/data/supplier";
import { SupplierSelector } from "./SupplierSelector";
import { UnitSelector } from "./UnitSelector";
import { invoiceExternalStore } from "../action";

interface iAppProps {
  data?: invoiceShowType;
}

const InvoiceExternalForm = ({ data }: iAppProps) => {
  console.log(data);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      date: data?.date || new Date().toISOString().slice(0, 10),
      due_date: data?.due_date || 0,
      supplier_id: data?.supplier_id || 1,
      description: data?.description || "",
      attachment: null,
      status: data?.status || "REQUEST",
      total_amount: Number(data?.total_amount) || 0,
      units:
        data?.units?.map((d: invoiceShowType["units"][number]) => d.unit) || [],
    }),
    [data],
  );

  const form = useForm<invoiceExternalSchemaType>({
    resolver: zodResolver(invoiceExternalSchema),
    defaultValues,
  });

  const handleSupplierSelect = useCallback(
    (item: supplierShowType) => {
      form.setValue("supplier_id", item.id);
    },
    [form],
  );

  async function downloadMemo() {
    startTransition(async () => {
      try {
        const file = await memo(data.id);
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Memo_Invoice_${data.invoice_no.replaceAll("/", "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        alert("Error downloading file.");
      }
    });
  }

  function onSubmit(values: invoiceExternalSchemaType) {
    console.log("Form Values:", values);
    startTransition(async () => {
      const result = await invoiceExternalStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/invoice-external");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {data?.id
            ? `Edit Invoice External - ${data.invoice_external_no}`
            : "Create Invoice External"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid items-start grid-cols-1 gap-4 space-y-2 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jatuh Tempo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Jatuh Tempo (dalam hari)"
                        required
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <SupplierSelector
                      value={field.value}
                      onSelect={handleSupplierSelect}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment (Max Size: 1MB)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Browse File"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    {data?.attachment ? (
                      <div className="flex items-center gap-1">
                        <Paperclip className="size-4" />
                        <Link
                          href={`${env.NEXT_PUBLIC_BASE_URL}/storage/${data.attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {data.attachment.filename}
                        </Link>
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input placeholder="Keterangan" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <UnitSelector value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              <LoadingSwap isLoading={isPending}>
                {data?.id ? "Update" : "Create"}
              </LoadingSwap>
            </Button>
          </form>
        </Form>

        {data?.id ? (
          <Button
            className="w-full mt-6 bg-teal-500 cursor-pointer hover:bg-teal-600"
            disabled={isPending}
            onClick={downloadMemo}
          >
            <LoadingSwap isLoading={isPending}>Cetak Memo</LoadingSwap>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default InvoiceExternalForm;

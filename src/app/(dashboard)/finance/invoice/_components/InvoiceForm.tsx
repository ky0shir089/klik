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
import { useState, useTransition, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { invoiceSchema, invoiceSchemaType } from "@/lib/formSchema";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";
import { invoiceStore } from "../action";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { typeTrxShowType } from "@/data/type-trx";
import { coaShowType } from "@/data/coa";
import { bankAccountShowType } from "@/data/bank-account";
import InvoiceDetail, { defaultDetailItem } from "./InvoiceDetail";
import { pphShowType } from "@/data/pph";
import { Paperclip } from "lucide-react";
import { invoiceShowType } from "@/data/invoice";
import { invoiceUpdate, memo } from "../../list-invoice/_components/action";
import Link from "next/link";
import { env } from "@/lib/env";
import { SupplierSelector } from "./SupplierSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierShowType } from "@/data/supplier";

interface iAppProps {
  data?: invoiceShowType;
  typeTrxes: typeTrxShowType[];
  pphs: pphShowType[];
}

const InvoiceForm = ({ data, typeTrxes, pphs }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();
  const downloadFile = useAuthenticatedFileDownload();

  const selectedCoa = typeTrxes.find(
    (item) => item.id === data?.trx_id,
  )?.trx_dtl;
  const [coas, setCoas] = useState<coaShowType[]>(selectedCoa || []);
  const [supplierAccounts, setSupplierAccounts] = useState<
    bankAccountShowType[]
  >([]);

  const details = useMemo(
    () =>
      data?.details.map((item: invoiceShowType["details"][0]) => ({
        ...item,
        item_amount: Number(item.item_amount),
        pph_amount: Number(item.pph_amount),
        ppn_amount: Number(item.ppn_amount),
        total_amount: Number(item.total_amount),
        pph_rate: item.pph?.rate ?? 0,
      })) || [defaultDetailItem],
    [data?.details],
  );

  const defaultValues = useMemo(
    () => ({
      date: data?.date || new Date().toISOString().slice(0, 10),
      trx_id: data?.trx_id || null,
      supplier_id: data?.supplier_id || null,
      payment_method: data?.payment_method || "BANK",
      supplier_account_id: data?.supplier_account_id || null,
      description: data?.description || "",
      attachment: null,
      status: data?.status || "REQUEST",
      details,
    }),
    [data, details],
  );

  const form = useForm<invoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const paymentMethod = form.watch("payment_method");

  const handleSupplierSelect = useCallback(
    (item: supplierShowType) => {
      form.setValue("supplier_id", item.id);
      setSupplierAccounts(item.account ? [item.account] : []);
    },
    [form, setSupplierAccounts],
  );

  async function downloadMemo() {
    startTransition(async () => {
      const file = await memo(data.id);
      downloadFile(
        file,
        `Memo_Invoice_${data.invoice_no.replaceAll("/", "_")}.pdf`,
      );
    });
  }

  function onSubmit(values: invoiceSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await invoiceUpdate(data.id, values)
        : await invoiceStore(values);

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
        <CardTitle className="text-2xl">
          {data?.id ? `Edit Invoice - ${data.invoice_no}` : "Create Invoice"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                e.preventDefault();
              }
            }}
          >
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
                name="trx_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Trx</FormLabel>
                    <Select
                      required
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                        const selected = typeTrxes.find(
                          (t) => t.id === Number(val),
                        );
                        setCoas(selected?.trx_dtl ?? []);
                      }}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type Trx" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeTrxes.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cara Bayar</FormLabel>
                    <Select
                      required
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Cara Bayar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BANK">BANK</SelectItem>
                        <SelectItem value="KAS">KAS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod === "BANK" ? (
                <FormField
                  control={form.control}
                  name="supplier_account_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Rekening</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Nomor Rekening" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {supplierAccounts.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.bank.name} - {item.account_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

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

            <InvoiceDetail coas={coas} pphs={pphs} />

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

export default InvoiceForm;

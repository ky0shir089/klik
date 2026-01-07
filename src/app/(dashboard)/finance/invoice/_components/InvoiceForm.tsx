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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { invoiceSchema, invoiceSchemaType } from "@/lib/formSchema";
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
import { supplierShowType } from "@/data/supplier";
import { bankAccountShowType } from "@/data/bank-account";
import InvoiceDetail from "./InvoiceDetail";
import { pphShowType } from "@/data/pph";

interface iAppProps {
  suppliers: supplierShowType[];
  typeTrxes: typeTrxShowType[];
  pphs: pphShowType[];
}

const InvoiceForm = ({ suppliers, typeTrxes, pphs }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [typeTrxId, setTypeTrxId] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [supplierAccounts, setSupplierAccounts] = useState<
    bankAccountShowType[]
  >([]);
  const [coas, setCoas] = useState<coaShowType[]>([]);

  const form = useForm<invoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      payment_method: "BANK",
      supplier_account_id: null,
      attachment: null,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const paymentMethod = form.watch("payment_method");

  function onSubmit(values: invoiceSchemaType) {
    startTransition(async () => {
      const result = await invoiceStore(values);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-6">
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                required
                value={new Date().toISOString().slice(0, 10)}
                readOnly
              />
            </FormItem>

            <FormItem>
              <FormLabel>Type Trx</FormLabel>
              <Select
                required
                value={typeTrxId ? String(typeTrxId) : ""}
                onValueChange={(val) => {
                  setTypeTrxId(Number(val));
                  const selected = typeTrxes.find((t) => t.id === Number(val));
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

            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <Select
                required
                value={supplierId ? String(supplierId) : ""}
                onValueChange={(val) => {
                  setSupplierId(Number(val));
                  const selected = suppliers.find(
                    (item) => item.id === Number(val)
                  );
                  setSupplierAccounts([selected?.account]);
                }}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

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
                      required
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
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Browse File"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <InvoiceDetail form={form} coas={coas} pphs={pphs} />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceForm;

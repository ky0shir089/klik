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
import { NumericFormat } from "react-number-format";
import { coaShowType } from "@/data/coa";
import { supplierShowType } from "@/data/supplier";
import { bankAccountShowType } from "@/data/bank-account";

interface iAppProps {
  suppliers: supplierShowType[];
  typeTrxes: typeTrxShowType[];
}

const InvoiceForm = ({ suppliers, typeTrxes }: iAppProps) => {
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
      supplier_account_id: 0,
      inv_coa_id: 0,
      rv_id: null,
      description: "",
      amount: null,
    },
  });

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

        <FormField
          control={form.control}
          name="inv_coa_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Trx</FormLabel>
              <Select
                required
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Code Trx" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coas.map((item) => (
                    <SelectItem key={item.id} value={String(item.coa.id)}>
                      {item.coa.code} - {item.coa.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Input placeholder="Keterangan" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <NumericFormat
                  value={field.value}
                  customInput={Input}
                  thousandSeparator
                  onValueChange={(values) => {
                    field.onChange(values.floatValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

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
import { rvSchema, rvSchemaType } from "@/lib/formSchema";
import { rvStore } from "../action";
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
import { bankAccountShowType } from "@/data/bank-account";

interface iAppProps {
  bankAccounts: bankAccountShowType[];
  typeTrxes: typeTrxShowType[];
}

const RvForm = ({ bankAccounts, typeTrxes }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [coas, setCoas] = useState<coaShowType[]>([]);

  const form = useForm<rvSchemaType>({
    resolver: zodResolver(rvSchema),
    defaultValues: {
      date: "",
      type_trx_id: 0,
      description: "",
      pay_method: "",
      bank_account_id: null,
      coa_id: 0,
      starting_balance: null,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const payMethod = form.watch("pay_method");

  function onSubmit(values: rvSchemaType) {
    startTransition(async () => {
      const result = await rvStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/list-rv");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  required
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type_trx_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type Trx</FormLabel>
              <Select
                required
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => {
                  const selected = typeTrxes.find((t) => t.id === Number(val));
                  setCoas(selected?.trx_dtl ?? []);
                  field.onChange(Number(val));
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
          name="pay_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terima Ke</FormLabel>
              <Select
                required
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Terima Ke" />
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

        {payMethod === "BANK" ? (
          <FormField
            control={form.control}
            name="bank_account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank</FormLabel>
                <Select
                  required
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankAccounts.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={String(item.account_number)}
                      >
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
          name="coa_id"
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
                    <SelectValue placeholder="Select CoA" />
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
          name="starting_balance"
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

export default RvForm;

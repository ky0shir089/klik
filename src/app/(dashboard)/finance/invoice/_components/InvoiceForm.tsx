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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { typeTrxShowType } from "@/data/type-trx";
import { coaShowType } from "@/data/coa";
import { supplierShowType } from "@/data/supplier";
import { bankAccountShowType } from "@/data/bank-account";
import InvoiceDetail, { defaultDetailItem } from "./InvoiceDetail";
import { pphShowType } from "@/data/pph";
import { rvShowType } from "@/data/rv";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface iAppProps {
  suppliers: supplierShowType[];
  typeTrxes: typeTrxShowType[];
  pphs: pphShowType[];
  rvs: rvShowType[];
}

const InvoiceForm = ({ suppliers, typeTrxes, pphs, rvs }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [supplierAccounts, setSupplierAccounts] = useState<
    bankAccountShowType[]
  >([]);
  const [coas, setCoas] = useState<coaShowType[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<invoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      trx_id: null,
      supplier_id: null,
      payment_method: "BANK",
      supplier_account_id: null,
      description: "",
      attachment: null,
      details: [defaultDetailItem],
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="space-y-6">
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
                        (t) => t.id === Number(val)
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
                  {/* <Select
                    required
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => {
                      field.onChange(Number(val));
                      const selected = suppliers.find(
                        (item) => item.id === Number(val)
                      );
                      setSupplierAccounts(
                        selected?.account ? [selected.account] : []
                      );
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
                  </Select> */}

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? (() => {
                              const selected = suppliers.find(
                                (item) => item.id === field.value
                              );
                              return selected
                                ? `${selected.name}`
                                : "Select Supplier";
                            })()
                          : "Select Supplier"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0"
                      style={{ width: "var(--radix-popover-trigger-width)" }}
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Supplier found.</CommandEmpty>
                          <CommandGroup>
                            {suppliers.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={`${item.id}|${item.name}`}
                                onSelect={(currentValue) => {
                                  const id = currentValue.split("|")[0];
                                  field.onChange(Number(id));
                                  const selected = suppliers.find(
                                    (item) => item.id === Number(id)
                                  );
                                  setSupplierAccounts(
                                    selected?.account ? [selected.account] : []
                                  );
                                  setOpen(false);
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === item.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Browse File"
                      accept=".pdf"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <InvoiceDetail coas={coas} pphs={pphs} rvs={rvs} />

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

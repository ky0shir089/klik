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
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bankAccountSchema, bankAccountSchemaType } from "@/lib/formSchema";
import { bankAccountStore, bankAccountUpdate } from "../action";
import { bankAccountShowType } from "@/data/bank-account";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bankShowType } from "@/data/bank";
import { coaShowType } from "@/data/coa";

interface iAppProps {
  data?: bankAccountShowType;
  banks: bankShowType[];
  coas: coaShowType[];
}

const BankAccountForm = ({ data, banks, coas }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<bankAccountSchemaType>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      account_number: data?.account_number || "",
      account_name: data?.account_name || "",
      is_active: data?.is_active ?? true,
      bank_id: data?.bank_id || null,
      coa_id: data?.coa_id || null,
    },
  });

  function onSubmit(values: bankAccountSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await bankAccountUpdate(data?.id, values)
        : await bankAccountStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/accounting/bank-account");
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
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Rekening</FormLabel>
              <FormControl>
                <Input placeholder="Nomor Rekening" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Rekening</FormLabel>
              <FormControl>
                <Input placeholder="Nama Rekening" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Switch
                    className="h-6 w-11 [&>span]:h-5 [&>span]:w-5 [&>span[data-state=checked]]:translate-x-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <span>{field.value ? "ACTIVE" : "INACTIVE"}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_id"
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
                  {banks.map((item) => (
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
          name="coa_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CoA</FormLabel>
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
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
  );
};

export default BankAccountForm;

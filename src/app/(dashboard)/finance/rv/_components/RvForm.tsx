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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { rvSchema, type rvSchemaType } from "@/lib/formSchema";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
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
import { bankAccountShowType } from "@/data/bank-account";
import { invoiceShowType } from "@/data/invoice";
import { invoiceExternalShowType } from "@/data/invoice-external";
import { coaShowType } from "@/data/coa";

// Constants for business logic IDs
const COA_MONEY_IN_TRANSIT = 25;
const COA_EXTERNAL = 11;

interface iAppProps {
  bankAccounts: bankAccountShowType[];
  typeTrxes: typeTrxShowType[];
  moneyInTransit: invoiceShowType[];
  externals: invoiceExternalShowType[];
}

const RvForm = ({
  bankAccounts,
  typeTrxes,
  moneyInTransit,
  externals,
}: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();

  const form = useForm<rvSchemaType>({
    resolver: zodResolver(rvSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type_trx_id: 0,
      description: "",
      pay_method: "",
      bank_account_id: null,
      coa_id: 0,
      starting_balance: null,
      invoice_id: null,
    },
  });
  const { control, setValue, handleSubmit, reset } = form;

  const payMethod = useWatch({ control, name: "pay_method" });
  const coaId = useWatch({ control, name: "coa_id" });
  const typeTrxId = useWatch({ control, name: "type_trx_id" });

  /**
   * Derive COAs from the selected Transaction Type
   */
  const availableCoas = useMemo(() => {
    const selected = typeTrxes.find((t) => t.id === typeTrxId);
    return selected?.trx_dtl ?? [];
  }, [typeTrxId, typeTrxes]);

  function onSubmit(values: rvSchemaType) {
    startTransition(async () => {
      const result = await rvStore(values);

      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        reset();
        toast.success(result.message);
        router.push("/finance/list-rv");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={control}
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
          control={control}
          name="type_trx_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type Trx</FormLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
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
          control={control}
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
          control={control}
          name="pay_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terima Ke</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
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
            control={control}
            name="bank_account_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank</FormLabel>
                <Select
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
                      <SelectItem key={item.id} value={String(item.account_number)}>
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
          control={control}
          name="coa_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Trx</FormLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select CoA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCoas.map((item: coaShowType) => (
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

        {[COA_MONEY_IN_TRANSIT, COA_EXTERNAL].includes(coaId) ? (
          <FormField
            control={control}
            name="invoice_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice No</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => {
                    const id = Number(val);
                    field.onChange(id);
                    if (coaId === COA_MONEY_IN_TRANSIT) {
                      const amount = moneyInTransit.find(
                        (m) => m.invoice_id === id,
                      );
                      setValue("starting_balance", amount?.total_amount ?? 0);
                    }
                    if (coaId === COA_EXTERNAL) {
                      const amount = externals.find((m) => m.id === id);
                      setValue("starting_balance", amount?.grand_total ?? 0);
                    }
                  }}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Invoice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coaId === COA_MONEY_IN_TRANSIT &&
                      moneyInTransit.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={String(item.invoice_id)}
                        >
                          {item.invoice.invoice_no} - {item.invoice.description}
                        </SelectItem>
                      ))}
                    {coaId === COA_EXTERNAL &&
                      externals.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.invoice_external_no} - {item.description}
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
          control={control}
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
                  readOnly={[COA_MONEY_IN_TRANSIT, COA_EXTERNAL].includes(
                    coaId,
                  )}
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

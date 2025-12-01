"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bankAccountShowType } from "@/data/bank-account";
import { pvShowType } from "@/data/pv";
import { pvSchema, pvSchemaType } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { pvStore } from "../action";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { paymentShowType } from "@/data/repayment";
import PaymentForm from "@/app/(dashboard)/klik/list-payment/_components/PaymentForm";
import { Eye } from "lucide-react";
import InvoiceAction from "../../list-invoice/_components/InvoiceAction";

interface iAppProps {
  data: pvShowType;
  bankAccounts: bankAccountShowType;
  payment?: paymentShowType;
}

const PvForm = ({ bankAccounts, data, payment }: iAppProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [isPending, startTransition] = useTransition();

  const updateArray = useCallback(
    (arr: number[], id: number, add: boolean) =>
      add ? [...arr, id] : arr.filter((item) => item !== id),
    []
  );

  const form = useForm<pvSchemaType>({
    resolver: zodResolver(pvSchema),
    defaultValues: {
      paid_date: new Date().toISOString().substring(0, 10),
      description: "",
      bank_account_id: 0,
      pvs: [],
    },
  });

  const watchedSubtotal = form.watch("pvs");
  const sumTotalAmount = watchedSubtotal
    ? data
        .filter((item: { id: number }) =>
          form.getValues("pvs").includes(item.id)
        )
        .reduce(
          (acc: number, item: { pv_amount: number }) => acc + item.pv_amount,
          0
        )
    : 0;

  const onSubmit = useCallback(
    (values: pvSchemaType) => {
      const trxDtl = data
        .filter((item: { id: number }) => values.pvs.includes(item.id))
        .map((item: { trx_dtl_id: number }) => item.trx_dtl_id);
      const uniqueTrxDtl = [...new Set(trxDtl)].length;
      if (uniqueTrxDtl > 1) {
        toast.error("Type Trx tidak sama");
        return;
      }

      startTransition(async () => {
        const result = await pvStore(values);
        if (result.success) {
          form.reset();
          toast.success(result.message);
          router.push("/finance/list-pv");
        } else {
          toast.error(result.message);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function createURL(paymentId: string, typeTrx: string) {
    params.set("paymentId", paymentId);
    params.set("typeTrx", typeTrx);
    router.replace(pathname + "?" + params);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="paid_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" required {...field} readOnly />
              </FormControl>
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
                  {bankAccounts.map((item: bankAccountShowType) => (
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

        <Table className={cn("border-2")}>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Balai Lelang</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Nomor Rekening</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: pvShowType) => (
              <TableRow key={item.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name="pvs"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                updateArray(
                                  field.value || [],
                                  item.id,
                                  !!checked
                                )
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>{item.processable?.branch_name}</TableCell>
                <TableCell>{item.processable?.customer.name}</TableCell>
                <TableCell>{item.supplier_account.supplier.name}</TableCell>
                <TableCell>{item.supplier_account.bank.name}</TableCell>
                <TableCell>{item.supplier_account.account_number}</TableCell>
                <TableCell className="text-right">
                  {item.pv_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        createURL(
                          String(item.processable_id),
                          String(item.trx_dtl_id)
                        );
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Submit"
                        className="rounded-full size-4"
                      >
                        <Eye />
                      </Button>
                    </DialogTrigger>
                    {payment ? (
                      <DialogContent className="min-w-fit">
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                          <DialogDescription></DialogDescription>
                          {item.trx_dtl_id == 2 ? (
                            <PaymentForm data={payment} />
                          ) : (
                            <InvoiceAction data={payment} />
                          )}
                        </DialogHeader>
                      </DialogContent>
                    ) : null}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell className="text-right">
                {sumTotalAmount.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
          <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default PvForm;

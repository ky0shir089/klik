"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerShowType } from "@/data/customer";
import {
  rvClassificationSchema,
  rvClassificationSchemaType,
} from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useMemo, useTransition } from "react";
import { Control, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { classificationStore } from "../action";
import { sumUnitFields } from "@/lib/helper";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface iAppProps {
  data: customerShowType;
}

const updateArray = (arr: number[], id: number, add: boolean) =>
  add ? [...arr, id] : arr.filter((item) => item !== id);

const RvTable = memo(function RvTable({
  control,
  rvs,
  sumRvAmount,
}: {
  control: Control<rvClassificationSchemaType>;
  rvs: Pick<customerShowType, "rvs"[0]>[];
  sumRvAmount: number;
}) {
  return (
    <div>
      <h3 className="text-xl">Data RV</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>RV No</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rvs.map((rv) => (
            <TableRow key={rv.id}>
              <TableCell>
                <FormField
                  control={control}
                  name="rvs"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(rv.id)}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              updateArray(field.value || [], rv.id, !!checked)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>{rv.rv_no}</TableCell>
              <TableCell>{rv.date}</TableCell>
              <TableCell>{rv.description}</TableCell>
              <TableCell className="text-right">
                {rv.ending_balance.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {sumRvAmount.toLocaleString("id-ID")}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
});

const RvClassificationForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<rvClassificationSchemaType>({
    resolver: zodResolver(rvClassificationSchema),
    defaultValues: {
      rvs: [],
      units: [],
    },
  });

  const selectedRvIds = useWatch({ control: form.control, name: "rvs" });
  const selectedUnitIds = useWatch({ control: form.control, name: "units" });

  const sumRvAmount = useMemo(() => {
    const selected = new Set(selectedRvIds);

    return (data.rvs || []).reduce(
      (acc: number, rv: { id: number; ending_balance: number }) => {
        return selected.has(rv.id) ? acc + rv.ending_balance : acc;
      },
      0
    );
  }, [selectedRvIds, data.rvs]);

  const {
    base: sumBasePrice,
    fee: sumFee,
    final: sumFinalPrice,
  } = useMemo(() => {
    return sumUnitFields(data.units, selectedUnitIds);
  }, [data.units, selectedUnitIds]);

  const allUnitIds = useMemo(
    () => (data.units || []).map((unit: { id: number }) => unit.id),
    [data.units]
  );

  function onSubmit(values: rvClassificationSchemaType) {
    if (sumRvAmount < sumFinalPrice) {
      toast.error("Jumlah RV kurang dari total amount");
      return;
    }

    startTransition(async () => {
      const payload = {
        rvs: [...values.rvs].sort((a, b) => a - b),
        units: [...values.units].sort((a, b) => a - b),
      };
      const result = await classificationStore(payload);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push(`/klik/rv-classification`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-xl">Data Customer</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>KTP Bidder</TableHead>
                <TableHead>Nama Bidder</TableHead>
                <TableHead>VA Bidder</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>{new Date().toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{data.ktp}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.va_number}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <RvTable
          control={form.control}
          rvs={data.rvs || []}
          sumRvAmount={sumRvAmount}
        />

        <div>
          <h3 className="text-xl">Data Unit</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={
                              allUnitIds.length > 0 &&
                              field.value?.length === allUnitIds.length
                            }
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? allUnitIds : [])
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableHead>
                <TableHead>Tgl Lelang</TableHead>
                <TableHead>Balai Lelang</TableHead>
                <TableHead>Nopol</TableHead>
                <TableHead>Noka</TableHead>
                <TableHead>Nosin</TableHead>
                <TableHead>Bukti Transfer</TableHead>
                <TableHead className="text-right">Harga Lelang</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <PhotoProvider>
                {(data.units || []).map(
                  (item: Pick<customerShowType, "units"[0]>) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.payment_status === "UNPAID" && (
                          <FormField
                            control={form.control}
                            name="units"
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
                        )}
                      </TableCell>
                      <TableCell>{item?.auction.auction_date}</TableCell>
                      <TableCell>{item?.auction.branch_name}</TableCell>
                      <TableCell>{item.police_number}</TableCell>
                      <TableCell>{item.chassis_number}</TableCell>
                      <TableCell>{item.engine_number}</TableCell>
                      <TableCell>
                        <ul>
                          {item?.transactions.map(
                            (sub: { id: number; receipt_link: string }) => (
                              <li key={sub.id}>
                                <PhotoView src={sub.receipt_link}>
                                  <Button
                                    type="button"
                                    variant="link"
                                    className="p-0"
                                  >
                                    Lihat Bukti
                                  </Button>
                                </PhotoView>
                              </li>
                            )
                          )}
                        </ul>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.admin_fee.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.final_price.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </PhotoProvider>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-right">
                  {sumBasePrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumFee.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumFinalPrice.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          <LoadingSwap isLoading={isPending}>Klasifikasi</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default RvClassificationForm;

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
import { sppSchema, sppSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { sumUnitFields } from "@/lib/helper";
import { sppStore } from "../action";

interface iAppProps {
  data: customerShowType;
}

const updateArray = (arr: number[], id: number, add: boolean) =>
  add ? [...arr, id] : arr.filter((item) => item !== id);

const SppForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<sppSchemaType>({
    resolver: zodResolver(sppSchema),
    defaultValues: {
      customer_id: data.klik_bidder_id,
      units: [],
    },
  });

  const selectedUnitIds = useWatch({ control: form.control, name: "units" });

  const {
    base: sumBasePrice,
    ticket: sumTicketPrice,
    fee: sumFee,
    final: sumFinalPrice,
    distributed: sumDistributed,
    diff: sumDiff,
  } = useMemo(() => {
    return sumUnitFields(data.units, selectedUnitIds);
  }, [data.units, selectedUnitIds]);

  const allUnitIds = useMemo(
    () => (data.units || []).map((unit: { id: number }) => unit.id),
    [data.units]
  );

  function onSubmit(values: sppSchemaType) {
    const checkSppStatus = data.units.filter(
      (unit: Pick<customerShowType, "units"[0]>) =>
        values.units.includes(unit.id) && unit.spp_status === null
    );

    if (checkSppStatus.length > 0) {
      toast.error("Unit belum memiliki no paket dan no kontrak");
      return;
    }

    const selectedUnits = data.units.filter(
      (unit: Pick<customerShowType, "units"[0]>) =>
        values.units.includes(unit.id)
    );
    const branchNames = new Set(
      selectedUnits.map(
        (unit: Pick<customerShowType, "units"[0]>) => unit.auction.branch_name
      )
    );

    if (branchNames.size > 1) {
      toast.error(
        "Semua unit yang dipilih harus berasal dari balai lelang yang sama."
      );
      return;
    }

    startTransition(async () => {
      const result = await sppStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push(`/klik/spp`);
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
                <TableHead>No Kontrak</TableHead>
                <TableHead>No Paket</TableHead>
                <TableHead className="text-right">Harga Lelang</TableHead>
                <TableHead className="text-right">Potongan Tiket</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Harga Distribusi</TableHead>
                <TableHead className="text-right">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.units || []).map(
                (item: Pick<customerShowType, "units"[0]>) => (
                  <TableRow key={item.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{item?.auction.auction_date}</TableCell>
                    <TableCell>{item?.auction.branch_name}</TableCell>
                    <TableCell>{item.police_number}</TableCell>
                    <TableCell>{item.chassis_number}</TableCell>
                    <TableCell>{item.engine_number}</TableCell>
                    <TableCell>{item.contract_number}</TableCell>
                    <TableCell>{item.package_number}</TableCell>
                    <TableCell className="text-right">
                      {item.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.ticket_price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.admin_fee.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.final_price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.distributed_price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.diff_price.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>Total</TableCell>
                <TableCell className="text-right">
                  {sumBasePrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumTicketPrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumFee.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumFinalPrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumDistributed.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {sumDiff.toLocaleString("id-ID")}
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
          <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default SppForm;

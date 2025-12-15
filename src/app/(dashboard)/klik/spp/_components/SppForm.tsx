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

// const RvTable = memo(function RvTable({
//   rvs,
// }: {
//   rvs: Pick<customerShowType, "rvs"[0]>[];
// }) {
//   const sumRvAmount = rvs.reduce((acc, rv) => acc + rv.starting_balance, 0);

//   return (
//     <div>
//       <h3 className="text-xl">Data RV</h3>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>RV No</TableHead>
//             <TableHead>Tanggal</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {rvs.map((rv) => (
//             <TableRow key={rv.id}>
//               <TableCell>{rv.rv_no}</TableCell>
//               <TableCell>{rv.date}</TableCell>
//               <TableCell>{rv.description}</TableCell>
//               <TableCell className="text-right">
//                 {rv.starting_balance.toLocaleString("id-ID")}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell colSpan={3}>Total</TableCell>
//             <TableCell className="text-right">
//               {sumRvAmount.toLocaleString("id-ID")}
//             </TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </div>
//   );
// });

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
    fee: sumFee,
    final: sumFinalPrice,
  } = useMemo(() => {
    return sumUnitFields(data.units, selectedUnitIds);
  }, [data.units, selectedUnitIds]);

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
        router.push(`/klik/memo-payment`);
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

        {/* <RvTable rvs={data.rvs || []} /> */}

        <div>
          <h3 className="text-xl">Data Unit</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Tgl Lelang</TableHead>
                <TableHead>Balai Lelang</TableHead>
                <TableHead>Nopol</TableHead>
                <TableHead>Noka</TableHead>
                <TableHead>Nosin</TableHead>
                <TableHead>No Kontrak</TableHead>
                <TableHead>No Paket</TableHead>
                <TableHead className="text-right">Harga Lelang</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Total</TableHead>
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
                      {item.admin_fee.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.final_price.toLocaleString("id-ID")}
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
          <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default SppForm;

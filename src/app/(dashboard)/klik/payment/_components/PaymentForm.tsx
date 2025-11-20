"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { paymentSchema, paymentSchemaType } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useTransition } from "react";
import { Control, useForm, useWatch } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { paymentStore, uploadDataUnit } from "../action";

interface iAppProps {
  data: customerShowType;
}

const updateArray = (arr: number[], id: number, add: boolean) =>
  add ? [...arr, id] : arr.filter((item) => item !== id);

const RvTable = memo(function RvTable({
  control,
  rvs,
}: {
  control: Control<paymentSchemaType>;
  rvs: Pick<customerShowType, "rvs"[0]>[];
}) {
  const selectedRvIds = useWatch({ control, name: "rvs" });
  const sumRvAmount = useMemo(() => {
    const selectedRvs = new Set(selectedRvIds);
    return rvs
      .filter((rv) => selectedRvs.has(rv.id))
      .reduce((acc, rv) => acc + rv.ending_balance, 0);
  }, [selectedRvIds, rvs]);

  return (
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
  );
});

const PaymentForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const result = await uploadDataUnit({
        id: data.klik_bidder_id,
        file: acceptedFiles[0],
      });
      if (result.success) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error(result.message || "File upload failed.");
      }
    },
    [data.klik_bidder_id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const form = useForm<paymentSchemaType>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      branch_id: data.units[0]?.auction.branch_id,
      branch_name: data.units[0]?.auction.branch_name,
      customer_id: data.klik_bidder_id,
      rvs: [],
      units: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRvIds = form.watch("rvs");
  const sumRvAmount = useMemo(() => {
    const selectedRvs = new Set(selectedRvIds);
    return (data.rvs || [])
      .filter((rv: { id: number }) => selectedRvs.has(rv.id))
      .reduce(
        (acc: number, rv: { ending_balance: number }) =>
          acc + rv.ending_balance,
        0
      );
  }, [selectedRvIds, data.rvs]);

  const selectedUnitIds = form.watch("units");
  const selectedUnits = useMemo(() => {
    return new Set(selectedUnitIds);
  }, [selectedUnitIds]);

  const sumUnitAmount = useMemo(() => {
    return (data.units || [])
      .filter((unit: { id: number }) => selectedUnits.has(unit.id))
      .reduce(
        (acc: number, unit: { final_price: number }) => acc + unit.final_price,
        0
      );
  }, [data.units, selectedUnits]);

  const checkContract = useMemo(() => {
    return (data.units || [])
      .filter((unit: { id: number }) => selectedUnits.has(unit.id))
      .filter(
        (item: { contract_number: string; package_number: number }) =>
          (item.contract_number || item.package_number) == null
      );
  }, [data.units, selectedUnits]);

  const onSubmit = useCallback(
    (values: paymentSchemaType) => {
      if (sumRvAmount < sumUnitAmount) {
        toast.error("Jumlah RV kurang dari total amount");
        return;
      }

      if (checkContract.length > 0) {
        toast.error("Unit belum memiliki No Kontrak atau No Paket");
        return;
      }

      startTransition(async () => {
        const result = await paymentStore(values);
        if (result.success) {
          form.reset();
          toast.success(result.message);
          router.push(`/klik/list-payment/${result.data.id}`);
        } else {
          toast.error(result.message);
        }
      });
    },
    [form, router, sumRvAmount, sumUnitAmount, checkContract]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Pelunasan</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead>KTP Bidder</TableHead>
                    <TableCell>{data.ktp}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead>Nama Bidder</TableHead>
                    <TableCell>{data.name}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell>NEW</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <RvTable control={form.control} rvs={data.rvs || []} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Tgl Lelang</TableHead>
                  <TableHead>Balai Lelang</TableHead>
                  <TableHead>No Lot</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Nopol</TableHead>
                  <TableHead>Noka</TableHead>
                  <TableHead>Nosin</TableHead>
                  <TableHead>No Kontrak</TableHead>
                  <TableHead>No Paket</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Admin Fee</TableHead>
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
                      <TableCell>{item.lot_number}</TableCell>
                      <TableCell>{item?.auction.auction_name}</TableCell>
                      <TableCell>{item.police_number}</TableCell>
                      <TableCell>{item.chassis_number}</TableCell>
                      <TableCell>{item.engine_number}</TableCell>
                      <TableCell>{item.contract_number}</TableCell>
                      <TableCell>{item.package_number}</TableCell>
                      <TableCell className="text-right">
                        {item.final_price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.admin_fee.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={10}>Total</TableCell>
                  <TableCell className="text-right">
                    {sumUnitAmount.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <h3 className="font-medium">Upload No Kontrak dan No Paket</h3>

            <div
              {...getRootProps()}
              className="p-8 border-2 border-dashed border-info"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center">Drop the files here ...</p>
              ) : (
                <p className="text-center">
                  Drag &apos;n&apos; drop some files here, or click to select
                  files
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;

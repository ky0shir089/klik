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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  rvClassificationSchema,
  rvClassificationSchemaType,
} from "@/lib/formSchema";
import { rvUpdate } from "../action";
import { rvShowType } from "@/data/rv";
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
  TableHead,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Label } from "@/components/ui/label";

interface iAppProps {
  data: rvShowType;
}

export interface BidderProps {
  id_penawar: number;
  identitas_ktp: string;
  nama_ktp: string;
  id_cabang: number;
  balai_lelang: string;
}

const ClassificationForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [bidders, setBidders] = useState<BidderProps[]>([]);

  const form = useForm<rvClassificationSchemaType>({
    resolver: zodResolver(rvClassificationSchema),
    defaultValues: {
      rv_id: data.id,
      customer_id: 0,
    },
  });

  function onSubmit(values: rvClassificationSchemaType) {
    startTransition(async () => {
      const customer = bidders.filter(
        (item) => item.id_penawar === values.customer_id
      )[0];
      
      const joinValues = {
        ...values,
        klik_bidder_id: customer.id_penawar,
        ktp: customer.identitas_ktp,
        name: customer.nama_ktp,
        branch_id: customer.id_cabang,
        branch_name: customer.balai_lelang,
      };

      const result = await rvUpdate(data?.id, joinValues);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/list-rv");
      } else {
        toast.error(result.message);
      }
    });
  }

  async function getBidders(date: string) {
    await axios
      .get("https://api.kliklelang.co.id/api/report/v3/hasil_lelang", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJjbGllbnRfaWQiOjE1NTM0LCJjbGllbnRfcGxhdGZvcm0iOiJtb2JpbGUiLCJjbGllbnRfcm9sZSI6ImJhbGFuZyIsImNsaWVudF90eXBlIjoiaGVhZG9mZmljZSIsImV4cCI6MTc2NDgzNTQ3NX0.dYhlMY77tx69kznw8fU4IF6FYPFceI_ZlvnOLOUVwxs",
        },
        params: {
          date_start: date,
          date_end: date,
        },
      })
      .then((res) => {
        const { data } = res.data;
        if (!data) return;
        const winnerData = data.filter(
          (item: { id_penawar: number }) => item.id_penawar !== null
        );
        const listBidder = winnerData.filter(
          (obj: BidderProps, index: number, self: BidderProps[]) =>
            index ===
            self.findIndex(
              (t: { id_penawar: number }) => t.id_penawar === obj.id_penawar
            )
        );
        setBidders(listBidder);
      })
      .catch(() => setBidders([]));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Klasifikasi RV</CardTitle>
      </CardHeader>

      <CardContent className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4")}>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>RV No</TableHead>
              <TableCell>{data.rv_no}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableCell>{data.date}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Type Trx</TableHead>
              <TableCell>
                {data.type_trx.code} - {data.type_trx.name}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Keterangan</TableHead>
              <TableCell>{data.description}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Bank</TableHead>
              <TableCell>
                {data.account.bank.name} - {data.account.account_number} -{" "}
                {data.account.account_name}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>CoA</TableHead>
              <TableCell>
                {data.account.coa.code} - {data.account.coa.description}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Amount</TableHead>
              <TableCell>
                {data.starting_balance.toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="date">Tgl Lelang</Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={(e) => getBidders(e.target.value)}
              />
            </div>

            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bidder</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bidder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bidders.map((item, index) => (
                        <SelectItem key={index} value={String(item.id_penawar)}>
                          {item.nama_ktp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>Klasifikasi</LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClassificationForm;

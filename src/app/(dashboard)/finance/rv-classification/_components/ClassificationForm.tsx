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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { getBiddersType } from "@/data/klik";
import { branchProps } from "../[rvId]/edit/page";

interface iAppProps {
  data: rvShowType;
  bidderList: getBiddersType[];
  listBalaiLelang: branchProps[];
}

const ClassificationForm = ({
  data,
  bidderList,
  listBalaiLelang,
}: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [date, setDate] = useState(params.get("date") ?? "");
  const [branchId, setBranchId] = useState(params.get("branch_id") ?? "");

  const form = useForm<rvClassificationSchemaType>({
    resolver: zodResolver(rvClassificationSchema),
    defaultValues: {
      rv_id: data.id,
      klik_bidder_id: 0,
    },
  });

  function onSubmit(values: rvClassificationSchemaType) {
    startTransition(async () => {
      const customer = bidderList.filter(
        (item) => Number(item.id_bidder) === values.klik_bidder_id
      )[0];

      const joinValues = {
        ...values,
        ktp: customer.identitas_ktp,
        name: customer.nama_ktp,
        branch_id: customer.id_cabang,
        branch_name: customer.balai_lelang,
        lelang: customer.lelang,
      };

      const result = await rvUpdate(data?.id, joinValues);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/klik/payment");
      } else {
        toast.error(result.message);
      }
    });
  }

  async function createDateURL(date: string) {
    params.set("date", date);
    router.replace(pathname + "?" + params);
  }

  async function createBranchURL(branch: string) {
    params.set("branch_id", branch);
    router.replace(pathname + "?" + params);
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid items-center w-full gap-3">
              <Label htmlFor="date">Tgl Lelang</Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={(e) => createDateURL(e.target.value)}
              />
            </div>

            <div className="grid items-center w-full gap-3">
              <Label htmlFor="branch_id">Balai Lelang</Label>
              <Select
                value={branchId}
                onValueChange={(val) => {
                  setBranchId(val);
                  createBranchURL(val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {listBalaiLelang.map((item) => (
                    <SelectItem
                      key={item.id_cabang}
                      value={String(item.id_cabang)}
                    >
                      {item.balai_lelang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="klik_bidder_id"
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
                      {bidderList.map((item) => (
                        <SelectItem
                          key={item.id_bidder}
                          value={String(item.id_bidder)}
                        >
                          {item.nama_ktp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>Klasifikasi</LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClassificationForm;

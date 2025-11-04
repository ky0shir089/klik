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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trxDtlSchema, trxDtlSchemaType } from "@/lib/formSchema";
import { trxDtlStore, trxDtlUpdate } from "../action";
import { trxDtlShowType } from "@/data/trx-dtl";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { typeTrxShowType } from "@/data/type-trx";
import { coaShowType } from "@/data/coa";

interface iAppProps {
  data?: trxDtlShowType;
  trxes: typeTrxShowType[];
  coas: coaShowType[];
}

const TrxDtlForm = ({ data, trxes, coas }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<trxDtlSchemaType>({
    resolver: zodResolver(trxDtlSchema),
    defaultValues: {
      trx_id: data?.trx_id || "",
      coa_id: data?.coa_id || "",
      is_active: data?.is_active ?? true,
    },
  });

  function onSubmit(values: trxDtlSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await trxDtlUpdate(data?.id, values)
        : await trxDtlStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/accounting/trx-detail");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
          {data?.id ? "Edit" : "Create"} Trx Detail
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="trx_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Trx</FormLabel>
                  <Select
                    required
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type Trx" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trxes.map((item) => (
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
                          {item.code} - {item.description}
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

            <Button type="submit" className="w-full" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>
                {data?.id ? "Update" : "Create"}
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TrxDtlForm;

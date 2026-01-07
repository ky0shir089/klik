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
import { pphSchema, pphSchemaType } from "@/lib/formSchema";
import { pphStore, pphUpdate } from "../action";
import { pphShowType } from "@/data/pph";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { coaShowType } from "@/data/coa";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";

interface iAppProps {
  data?: pphShowType;
  coas: coaShowType[];
}

const PphForm = ({ data, coas }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<pphSchemaType>({
    resolver: zodResolver(pphSchema),
    defaultValues: {
      name: data?.name || "",
      rate: data?.rate || "",
      coa_id: data?.coa_id || "",
    },
  });

  function onSubmit(values: pphSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await pphUpdate(data?.id, values)
        : await pphStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/accounting/pph");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>% Rate</FormLabel>
              <FormControl>
                <NumericFormat
                  value={field.value}
                  customInput={Input}
                  thousandSeparator
                  onValueChange={(values) => {
                    field.onChange(values.floatValue);
                  }}
                />
              </FormControl>
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

export default PphForm;

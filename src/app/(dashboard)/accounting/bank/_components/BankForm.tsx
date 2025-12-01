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
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bankSchema, bankSchemaType } from "@/lib/formSchema";
import { bankStore, bankUpdate } from "../action";
import { bankShowType } from "@/data/bank";
import { LoadingSwap } from "@/components/ui/loading-swap";

interface iAppProps {
  data?: bankShowType;
}

const BankForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<bankSchemaType>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      name: data?.name || "",
      logo: null,
    },
  });

  function onSubmit(values: bankSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await bankUpdate(data?.id, values)
        : await bankStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/accounting/bank");
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
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Bank Name" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Browse File"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
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
          <LoadingSwap isLoading={isPending}>
            {data?.id ? "Update" : "Create"}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default BankForm;

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
import { auctionSchema, auctionSchemaType } from "@/lib/formSchema";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { auctionStore } from "../action";

const AuctionForm = ({ userId }: { userId: number }) => {
  console.log(userId);
  const [isPending, startTransition] = useTransition();

  const form = useForm<auctionSchemaType>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      auction_date: new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(values: auctionSchemaType) {
    startTransition(async () => {
      const result = await auctionStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 sm:w-1/2"
      >
        <FormField
          control={form.control}
          name="auction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lelang</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  readOnly={userId == 1 ? false : true}
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
          <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default AuctionForm;

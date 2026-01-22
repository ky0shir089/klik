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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { coaShowType } from "@/data/coa";
import { journalInputSchema, journalInputSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { journalInputStore } from "../action";
import { Label } from "@/components/ui/label";
import JournalDetail, { defaultDetailItem } from "./JournalDetail";
import { journalShowType } from "@/data/journal-input";

interface JournalFormProps {
  data?: journalShowType;
  coas: coaShowType[];
}

const JournalForm = ({ data, coas }: JournalFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<journalInputSchemaType>({
    resolver: zodResolver(journalInputSchema),
    defaultValues: {
      date: data?.date || new Date().toISOString().slice(0, 10),
      description: data?.description || "",
      details: data?.details || [defaultDetailItem],
    },
  });

  const details = useWatch({
    control: form.control,
    name: "details",
  });

  const totalDebit =
    details?.reduce((acc, item) => acc + (item.debit || 0), 0) || 0;

  const totalCredit =
    details?.reduce((acc, item) => acc + (item.credit || 0), 0) || 0;

  function onSubmit(values: journalInputSchemaType) {
    if (totalDebit !== totalCredit) {
      toast.error("Total Debit and Credit must be equal");
      return;
    }

    startTransition(async () => {
      const result = await journalInputStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/accounting/list-journal");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    required
                    {...field}
                    readOnly={data?.gl_no ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Keterangan"
                    required
                    {...field}
                    readOnly={data?.gl_no ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {data?.gl_no ? (
            <div className="grid w-fit items-center gap-3">
              <Label htmlFor="created_by">Created By</Label>
              <Input value={data.details[0].user.name} readOnly />
            </div>
          ) : null}
        </div>

        <JournalDetail
          data={data}
          coas={coas}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
        />

        {data?.gl_no ? null : (
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default JournalForm;

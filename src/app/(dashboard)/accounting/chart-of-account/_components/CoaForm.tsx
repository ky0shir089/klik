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
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { coaSchema, coaSchemaType } from "@/lib/formSchema";
import { coaStore, coaUpdate } from "../action";
import { coaShowType } from "@/data/coa";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface iAppProps {
  data?: coaShowType;
  coas: coaShowType[];
}

const CoaForm = ({ data, coas }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<coaSchemaType>({
    resolver: zodResolver(coaSchema),
    defaultValues: {
      code: data?.code || "",
      description: data?.description || "",
      type: data?.type || "",
      parent_id: data?.parent_id || null,
    },
  });

  useEffect(() => {
    form.reset({
      code: data?.code || "",
      description: data?.description || "",
      type: data?.type || "",
      parent_id: data?.parent_id || null,
    });
  }, [data, form]);

  function onSubmit(values: coaSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await coaUpdate(data?.id, values)
        : await coaStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
          {data?.id ? "Edit" : "Create"} COA
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Code" required {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    required
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ASSET">ASSET</SelectItem>
                      <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                      <SelectItem value="LIABILITIES">LIABILITIES</SelectItem>
                      <SelectItem value="OWNER">OWNER</SelectItem>
                      <SelectItem value="REVENUE">REVENUE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parent" />
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

            <Button type="submit" className="w-full" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>
                {data?.id ? "Update" : "Create"}
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>

      {data?.id && (
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => router.push("/accounting/chart-of-account")}
            className="w-full"
          >
            Reset
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CoaForm;

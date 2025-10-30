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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { moduleSchema, moduleSchemaType } from "@/lib/formSchema";
import { moduleStore, moduleUpdate } from "../action";
import { moduleShowType } from "@/data/module";
import { LoadingSwap } from "@/components/ui/loading-swap";

interface iAppProps {
  data?: moduleShowType;
}

const ModuleForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<moduleSchemaType>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: data?.name || "",
      icon: data?.icon || "",
      position: data?.position || 1,
    },
  });

  function onSubmit(values: moduleSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await moduleUpdate(data?.id, values)
        : await moduleStore(values);

      if (result.success) {
        toast.success(result.message);
        router.push("/setup-aplikasi/module");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>
          {data?.id ? "Edit" : "Create"} Module
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input placeholder="Icon" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Position"
                      required
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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

export default ModuleForm;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFileSchema, uploadFileSchemaType } from "@/lib/formSchema";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { CheckCircle, CircleX } from "lucide-react";
import Link from "next/link";
import { uploadSpp } from "../action";

const Summary = ({ results }: { results: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary:</CardTitle>
      </CardHeader>

      <CardContent>
        {results.length === 0 ? (
          <div className="flex items-center">
            <CheckCircle className="mr-1 text-green-500 size-6" />
            Semua Data OK
          </div>
        ) : (
          results.map((error, index) => (
            <div key={index} className="flex items-center">
              <CircleX className="mr-1 text-red-500 size-6" />
              <p>{error}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const UploadSppForm = () => {
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);
  const [results, setResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<uploadFileSchemaType>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: null,
    },
  });

  function onSubmit(values: uploadFileSchemaType) {
    startTransition(async () => {
      setResults([]);

      const result = await uploadSpp(values);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setResults(result.data);
      }

      form.reset();
      setFormKey((prev) => prev + 1);
      setIsSubmitting(true);
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-2xl")}>Upload SPP</CardTitle>
          <CardDescription>
            Contoh template upload download{" "}
            <Link
              href="/template/data_unit.xlsx"
              className="text-blue-500 underline"
            >
              disini
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                key={formKey}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Browse File</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        placeholder="Browse File"
                        required
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
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
                <LoadingSwap isLoading={isPending}>Upload</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isSubmitting ? <Summary results={results} /> : null}
    </>
  );
};

export default UploadSppForm;

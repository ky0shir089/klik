"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { invoiceStatusSchemaType } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { useRef, useTransition } from "react";
import { statusUpdate } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { invoiceShowType } from "@/data/invoice";
import Signature from "@uiw/react-signature";
import InvoiceData from "@/components/InvoiceData";

interface iAppProps {
  data: invoiceShowType;
}

const InvoiceAction = ({ data }: iAppProps) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $svg = useRef<any>(null);

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();

  const points = {
    "path-1": JSON.parse(data.signature) ?? [],
  };

  function onSubmit(status: string) {
    const values = {
      ...data,
      status,
      signature: null,
    };

    startTransition(async () => {
      const result = await statusUpdate(data.id, values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/list-invoice");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Invoice Detail</CardTitle>
      </CardHeader>

      <CardContent>
        <InvoiceData data={data} points={points} />

        {points["path-1"].length > 0 ? (
          <div className="flex items-center justify-center w-full">
            <div className="w-full h-auto border-2 border-yellow-500 sm:max-w-sm">
              <Signature ref={$svg} defaultPoints={points} readonly />
            </div>
          </div>
        ) : null}
      </CardContent>

      {data.status === "APPROVE" ? (
        <CardFooter className={cn("flex gap-2")}>
          <Button
            type="submit"
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={() => onSubmit("CANCEL")}
          >
            <LoadingSwap isLoading={isPending}>Cancel</LoadingSwap>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default InvoiceAction;

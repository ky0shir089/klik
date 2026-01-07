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
import { useRef, useState, useTransition } from "react";
import { invoiceUpdate } from "./action";
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

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [points, setPoints] = useState<number[][]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $svg = useRef<any>(null);
  const handle = () => {
    $svg.current?.clear();
    setPoints([]);
  };

  const handlePoints = (data: number[][]) => {
    if (data.length > 0) {
      setPoints([...points, ...data]);
    }
  };

  function onSubmit(values: invoiceStatusSchemaType) {
    startTransition(async () => {
      const result = await invoiceUpdate(data.id, values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/approval-invoice");
      } else {
        toast.error(result.message);
      }
    });
  }
  console.log(points);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-2xl")}>Invoice Detail</CardTitle>
        </CardHeader>

        <CardContent>
          <InvoiceData data={data} />
        </CardContent>

        {data.status === "REQUEST" && !isApprove ? (
          <CardFooter className={cn("flex gap-2")}>
            <Button
              type="submit"
              variant="destructive"
              className="w-1/2"
              onClick={() => onSubmit({ status: "REJECT", signature: null })}
            >
              <LoadingSwap isLoading={isPending}>Reject</LoadingSwap>
            </Button>

            <Button
              type="submit"
              className="w-1/2 bg-green-400"
              onClick={() => setIsApprove(true)}
            >
              <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {isApprove ? (
        <div className="mx-2 mb-10 border-2 border-yellow-500">
          <Signature ref={$svg} onPointer={handlePoints} />

          <div className="flex mt-2 gap-2">
            <Button
              type="button"
              className="w-1/2 bg-blue-500"
              onClick={handle}
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="w-1/2 bg-green-400"
              onClick={() => onSubmit({ status: "APPROVE", signature: points })}
            >
              <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default InvoiceAction;

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
import { useTransition } from "react";
import { invoiceUpdate } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { invoiceShowType } from "@/data/invoice";
// import Signature from "@uiw/react-signature";
import InvoiceData from "@/components/InvoiceData";

interface iAppProps {
  data: invoiceShowType;
}

const InvoiceAction = ({ data }: iAppProps) => {
  const router = useRouter();

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();
  // const [isApprove, setIsApprove] = useState<boolean>(false);
  // const [points, setPoints] = useState<number[][]>([]);

  // const $svg = useRef<any>(null);
  // const handle = () => {
  //   $svg.current?.clear();
  //   setPoints([]);
  // };

  // const handlePoints = (data: number[][]) => {
  //   if (data.length > 0) {
  //     setPoints((prev) => [...prev, ...data]);
  //   }
  // };

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-2xl")}>Invoice Detail</CardTitle>
        </CardHeader>

        <CardContent>
          <InvoiceData data={data} />
        </CardContent>

        {data.status === "REQUEST" ? (
          <CardFooter className={cn("grid grid-cols-2 gap-2")}>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => onSubmit({ status: "REJECT", signature: null })}
            >
              <LoadingSwap isLoading={isPending}>Reject</LoadingSwap>
            </Button>

            <Button
              type="submit"
              className="bg-green-400 "
              onClick={() => onSubmit({ status: "APPROVE", signature: null })}
            >
              <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {/* {isApprove ? (
        <div className="flex flex-col items-center justify-center w-full p-2 mx-2 mb-10 border-2 border-yellow-500">
          <p className="mb-2 text-sm font-medium">
            Please provide your signature to approve this invoice
          </p>

          <div className="w-full sm:max-w-sm">
            <Signature
              ref={$svg}
              onPointer={handlePoints}
              aria-label="Signature canvas"
            />
          </div>

          <div className="grid w-full grid-cols-3 gap-2 mt-2">
            <Button
              type="button"
              className="bg-orange-500"
              onClick={() => setIsApprove(false)}
            >
              Back
            </Button>
            <Button type="button" className="bg-blue-500" onClick={handle}>
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-green-400"
              onClick={() => {
                if (points.length === 0) {
                  toast.error("Signature is required");
                  return;
                }
                onSubmit({ status: "APPROVE", signature: points });
              }}
            >
              <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
            </Button>
          </div>
        </div>
      ) : null} */}
    </>
  );
};

export default InvoiceAction;

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
import { useEffect, useRef, useState, useTransition } from "react";
import { invoiceUpdate } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { invoiceShowType } from "@/data/invoice";
import Signature, { SignatureRef } from "@uiw/react-signature";
import InvoiceData from "@/components/InvoiceData";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { sppShowType } from "@/data/spp";
import Link from "next/link";

interface iAppProps {
  data: invoiceShowType;
  user: { id: number };
  spp?: sppShowType;
}

const InvoiceAction = ({ data, user, spp }: iAppProps) => {
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>("");
  const [points, setPoints] = useState<Record<string, number[][]>>({});
  const signatureContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isApprove) {
      signatureContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isApprove]);

  const $svg = useRef<SignatureRef>(null);
  const handle = () => {
    $svg.current?.clear();
    setPoints({});
  };

  const handlePoints = (data: number[][]) => {
    if (data.length > 0) {
      setPoints((prev) => ({
        ...prev,
        [`path-${Object.keys(prev).length + 1}`]: data,
      }));
    }
  };

  function onSubmit(status: string, remark?: string) {
    const values = {
      ...data,
      status,
      remark: remark || null,
      signature: Object.keys(points).length > 0 ? points : null,
      wf_history_id: data.wf_histories.filter(
        (item: { user_id: number }) => item.user_id == user.id,
      )[0].id,
    };

    startTransition(async () => {
      const result = await invoiceUpdate(data.id, values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/workflow/inbox");
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
          {spp ? (
            <Link
              href={`/klik/list-payment/${spp.id}`}
              className="text-xs text-blue-500 underline"
            >
              View Detail
            </Link>
          ) : null}
        </CardContent>

        {data.status === "REQUEST" ? (
          <CardFooter className={cn("grid grid-cols-2 gap-2")}>
            <AlertDialog
              open={isRejectModalOpen}
              onOpenChange={setIsRejectModalOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <LoadingSwap isLoading={isPending}>Reject</LoadingSwap>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Invoice</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide a reason for rejecting this invoice.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Enter rejection remark here..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRemark("")}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (!remark.trim()) {
                        toast.error("Remark is required for rejection");
                        return;
                      }
                      onSubmit("REJECT", remark);
                    }}
                    disabled={isPending}
                  >
                    <LoadingSwap isLoading={isPending}>
                      Confirm Reject
                    </LoadingSwap>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="button"
              className="bg-green-400 "
              onClick={() => setIsApprove(true)}
            >
              <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {isApprove ? (
        <div
          ref={signatureContainerRef}
          className="flex flex-col items-center justify-center w-full p-2 mx-2 mb-10 border-2 border-yellow-500"
        >
          <p className="mb-2 text-sm font-medium">
            Please provide your signature to approve this invoice
          </p>

          <div className="w-full sm:max-w-sm">
            <Signature ref={$svg} onPointer={handlePoints} />
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
                if (Object.keys(points).length === 0) {
                  toast.error("Signature is required");
                  return;
                }
                onSubmit("APPROVE");
              }}
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

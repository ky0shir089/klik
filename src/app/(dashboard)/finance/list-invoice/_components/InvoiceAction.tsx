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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { invoiceShowType } from "@/data/invoice";

interface iAppProps {
  data: invoiceShowType;
}

const InvoiceAction = ({ data }: iAppProps) => {
  const router = useRouter();

  const form = useForm<invoiceStatusSchemaType>();
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: invoiceStatusSchemaType) {
    startTransition(async () => {
      const result = await invoiceUpdate(data.id, values);

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
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableCell>
                {new Date(data.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Type Trx</TableHead>
              <TableCell>{data.trx_dtl.trx.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableCell>{data.supplier_account.supplier.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Nomor Rekening</TableHead>
              <TableCell>
                {data.supplier_account.bank.name} -{" "}
                {data.supplier_account.account_number}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>CoA</TableHead>
              <TableCell>
                {data.coa.code} - {data.coa.description}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Keterangan</TableHead>
              <TableCell>{data.description}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Amount</TableHead>
              <TableCell>{data.amount.toLocaleString("id-ID")}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead>Status</TableHead>
              <TableCell>{data.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      {data.status === "REQUEST" ? (
        <CardFooter className={cn("flex gap-2")}>
          <Button
            type="submit"
            variant="destructive"
            className="w-1/2"
            onClick={() => onSubmit({ status: "REJECT" })}
          >
            <LoadingSwap isLoading={isPending}>Reject</LoadingSwap>
          </Button>

          <Button
            type="submit"
            className="w-1/2 bg-green-400"
            onClick={() => onSubmit({ status: "APPROVE" })}
          >
            <LoadingSwap isLoading={isPending}>Approve</LoadingSwap>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
};

export default InvoiceAction;

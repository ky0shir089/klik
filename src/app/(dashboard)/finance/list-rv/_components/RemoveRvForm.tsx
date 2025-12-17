"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { rvUpdate } from "../action";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { rvShowType } from "@/data/rv";

interface iAppProps {
  data?: rvShowType;
}

const RemoveRvForm = ({ data }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const result = await rvUpdate(data?.id);

      if (result.success) {
        toast.success(result.message);
        router.push("/finance/list-rv");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>RV No</TableHead>
            <TableCell>{data.rv_no}</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableCell>{data.date}</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Type Trx</TableHead>
            <TableCell>
              {data.type_trx.code} - {data.type_trx.name}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Keterangan</TableHead>
            <TableCell>{data.description}</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Bank</TableHead>
            <TableCell>
              {data.account.bank.name} - {data.account.account_number} -{" "}
              {data.account.account_name}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>CoA</TableHead>
            <TableCell>
              {data.account.coa.code} - {data.account.coa.description}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Amount</TableHead>
            <TableCell>{data.ending_balance.toLocaleString("id-ID")}</TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Customer</TableHead>
            <TableCell>{data.customer?.name}</TableCell>
          </TableRow>

          {data.customer_id !== null && (
            <TableRow>
              <TableCell colSpan={2}>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                  onClick={onSubmit}
                >
                  <LoadingSwap isLoading={isPending}>Remove RV</LoadingSwap>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RemoveRvForm;

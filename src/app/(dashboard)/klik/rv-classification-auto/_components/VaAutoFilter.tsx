"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { xenditType } from "@/data/select";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type MouseEvent, useEffect, useState, useTransition } from "react";
import { downloadVaAuto, withdraw } from "../action";
import { toast } from "sonner";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPreviousDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return formatDateInput(date);
}

function getTodayDate() {
  return formatDateInput(new Date());
}

const VaAutoFilter = ({ xendits }: xenditType) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const downloadFile = useAuthenticatedFileDownload();

  const [transaction, setTransaction] = useState(
    () => searchParams.get("rv_id") ?? "",
  );
  const [fromDate, setFromDate] = useState(
    () => searchParams.get("from_date") ?? getPreviousDate(),
  );
  const [toDate, setToDate] = useState(
    () => searchParams.get("to_date") ?? getTodayDate(),
  );

  const [isPending, startTransition] = useTransition();
  const handleExpiredSession = useExpiredSessionRedirect();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const hasFromDate = searchParams.has("from_date");
    const hasToDate = searchParams.has("to_date");

    if (hasFromDate && hasToDate) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (!hasFromDate) {
      params.set("from_date", fromDate);
    }

    if (!hasToDate) {
      params.set("to_date", toDate);
    }

    replace(`${pathname}?${params.toString()}`);
  }, [fromDate, pathname, replace, searchParams, toDate]);

  async function withdrawXendit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const values = {
        start_date: fromDate,
        end_date: toDate,
      };

      const result = await withdraw(values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  async function downloadReport() {
    startTransition(async () => {
      const file = await downloadVaAuto(fromDate!, toDate!);
      downloadFile(file, `List_Unit_${fromDate}-${toDate}.xlsx`);
    });
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.8fr)_minmax(320px,1.2fr)]">
      <Select
        value={transaction}
        onValueChange={(value) => {
          setTransaction(value);
          updateParams({ rv_id: value });
        }}
      >
        <SelectTrigger className="w-full h-10">
          <SelectValue placeholder="Pilih transaksi" />
        </SelectTrigger>
        <SelectContent>
          {xendits.map((item: xenditType) => (
            <SelectItem key={item.id} value={item.id}>
              {item.ending_balance.toLocaleString("id-ID")} -{" "}
              {item.journal_number} - {item.date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-1">
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="relative flex items-center">
            <span className="sr-only">Tanggal dibayar dari</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(event) => {
                const value = event.target.value;
                setFromDate(value);
                updateParams({ from_date: value });
              }}
            />
          </label>

          <label className="relative flex items-center">
            <span className="sr-only">Tanggal dibayar sampai</span>
            <Input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(event) => {
                const value = event.target.value;
                setToDate(value);
                updateParams({ to_date: value });
              }}
            />
          </label>

          <Button
            type="button"
            onClick={withdrawXendit}
            className="bg-emerald-400 text-white"
          >
            <LoadingSwap isLoading={isPending}>Tarik Data Withdraw</LoadingSwap>
          </Button>

          <Button
            type="button"
            onClick={downloadReport}
            className="bg-sky-400 text-white"
          >
            <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VaAutoFilter;

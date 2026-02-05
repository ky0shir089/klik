"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportCash } from "../action";
import { useState, useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface cashProps {
  id: number;
  description: string;
}

const ReportCashForm = ({ cashes }: { cashes: cashProps[] }) => {
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [cash, setCash] = useState<number>(0);
  const [permission, setPermission] = useState<string>("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const values = {
      from,
      to,
      cash,
      permission,
    };

    startTransition(async () => {
      try {
        const file = await reportCash(values);
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-kas-${from}-${to}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Unathorized to download file.");
      }

      // setFrom("");
      // setTo("");
      // setCash(0);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report Kas</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="from">Dari</Label>
              <Input
                id="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="to">Sampai</Label>
              <Input
                id="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="to">Kas</Label>
              <Select
                value={cash ? String(cash) : ""}
                onValueChange={(val) => {
                  setCash(parseInt(val));
                  const selectedKas = cashes.find(
                    (item) => item.id === Number(val),
                  );
                  const slug =
                    selectedKas?.description.toLowerCase().replace(" ", "-") ||
                    "";
                  setPermission(`${slug}:download`);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Bank" />
                </SelectTrigger>
                <SelectContent>
                  {cashes.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isPending || !from || !to || !cash || !permission}
              className="max-w-sm"
            >
              <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportCashForm;

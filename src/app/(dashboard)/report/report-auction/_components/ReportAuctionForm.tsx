"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportAuction } from "../action";
import { useState, useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ReportAuctionForm = () => {
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  function onSubmit() {
    const values = {
      from,
      to,
    };

    startTransition(async () => {
      try {
        const file = await reportAuction(values);
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-lelang.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Error downloading file.");
      }

      setFrom("");
      setTo("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report Lelang</CardTitle>
      </CardHeader>

      <CardContent>
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

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending || !from || !to}
            className="max-w-sm"
          >
            <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportAuctionForm;

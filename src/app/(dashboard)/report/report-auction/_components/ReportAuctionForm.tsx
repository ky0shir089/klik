"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportAuction } from "../action";
import { useState, useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { env } from "@/lib/env";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

        const link = document.createElement("a");
        link.href = `${env.NEXT_PUBLIC_BASE_URL}/storage/${file}`;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Download error:", error);
        alert("Error downloading file.");
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
            disabled={isPending}
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

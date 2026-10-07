"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { reportTitipanBidder } from "../action";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";
import { Input } from "@/components/ui/input";

const ReportRvForm = () => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  function onSubmit() {
    const values = {
      from,
      to,
    };

    startTransition(async () => {
      const file = await reportTitipanBidder(values);
      downloadFile(file, "report-titipan-bidder.xlsx");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report Titipan Bidder</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid items-center w-full max-w-sm gap-3">
              <Label htmlFor="from">Dari</Label>
              <Input
                id="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="grid items-center w-full max-w-sm gap-3">
              <Label htmlFor="to">Sampai</Label>
              <Input
                id="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isPending || !from || !to}
          className="w-full max-w-sm"
        >
          <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportRvForm;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { reportRv } from "../action";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";
import { Input } from "@/components/ui/input";

const ReportRvForm = () => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [type, setType] = useState<string>("ALL");

  function onSubmit() {
    const values = {
      from,
      to,
      type,
    };

    startTransition(async () => {
      const file = await reportRv(values);
      downloadFile(file, "report-rv.xlsx");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report RV Titipan</CardTitle>
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

            <div className="grid items-center w-full max-w-sm gap-3">
              <Label htmlFor="to">Type</Label>
              <Select onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="57">Jaminan</SelectItem>
                  <SelectItem value="58">Pelunasan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={onSubmit}
              disabled={isPending || !from || !to}
            >
              <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportRvForm;

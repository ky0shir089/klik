"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportGl } from "../action";
import { useState, useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

const ReportGlForm = () => {
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const downloadFile = useAuthenticatedFileDownload();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const values = {
      from,
      to,
    };

    startTransition(async () => {
      const file = await reportGl(values);
      if (!downloadFile(file, "report-gl.xlsx")) {
        return;
      }

      setFrom("");
      setTo("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report GL</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="from">Dari</Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="to">Sampai</Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !from || !to}
            className="max-w-sm"
          >
            <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportGlForm;

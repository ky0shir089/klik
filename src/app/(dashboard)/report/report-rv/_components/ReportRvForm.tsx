"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportRv } from "../action";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";

const ReportRvForm = () => {
  const [isPending, startTransition] = useTransition();
  const downloadFile = useAuthenticatedFileDownload();

  function onSubmit() {
    startTransition(async () => {
      const file = await reportRv();
      downloadFile(file, "report-rv.xlsx");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report RV Titipan</CardTitle>
      </CardHeader>

      <CardContent>
        <Button type="button" onClick={onSubmit} disabled={isPending}>
          <LoadingSwap isLoading={isPending}>Download</LoadingSwap>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportRvForm;

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportRv } from "../action";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";

const ReportRvForm = () => {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      try {
        const file = await reportRv();
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-rv.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Error downloading file.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Report RV</CardTitle>
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

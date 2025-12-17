"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportRv } from "../action";
import { useTransition } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { env } from "@/lib/env";

const ReportRvForm = () => {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      try {
        const file = await reportRv();

        const link = document.createElement("a");
        link.href = `${env.NEXT_PUBLIC_BASE_URL}/storage/${file}`;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Download error:", error);
        alert("Error downloading file.");
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

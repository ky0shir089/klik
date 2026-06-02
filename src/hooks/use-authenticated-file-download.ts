"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";

interface DownloadOptions {
  errorMessage?: string;
}

export function useAuthenticatedFileDownload() {
  const handleExpiredSession = useExpiredSessionRedirect();

  return useCallback(
    (
      result: unknown,
      filename: string,
      options?: DownloadOptions,
    ) => {
      if (handleExpiredSession(result)) {
        return false;
      }

      if (!(result instanceof Blob)) {
        toast.error(options?.errorMessage ?? "Error downloading file.");
        return false;
      }

      const url = URL.createObjectURL(result);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 0);

      return true;
    },
    [handleExpiredSession],
  );
}

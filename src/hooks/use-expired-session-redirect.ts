"use client";

import {
  buildLogoutRedirect,
  sanitizeReturnPath,
  SESSION_EXPIRED_REASON,
} from "@/lib/auth-redirect";
import { isUnauthorizedResult } from "@/lib/auth-result";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useExpiredSessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  return useCallback(
    (result: unknown, options?: { reason?: string }) => {
      if (!isUnauthorizedResult(result)) {
        return false;
      }

      const nextPath = sanitizeReturnPath(
        queryString ? `${pathname}?${queryString}` : pathname,
      );

      router.replace(
        buildLogoutRedirect({
          next: nextPath,
          reason: options?.reason ?? SESSION_EXPIRED_REASON,
        }),
      );

      return true;
    },
    [pathname, queryString, router],
  );
}

import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildLoginRedirect,
  buildLogoutRedirect,
  CURRENT_PATH_HEADER,
  sanitizeReturnPath,
  SESSION_EXPIRED_REASON,
} from "@/lib/auth-redirect";
import { isUnauthorizedResult } from "@/lib/auth-result";

export async function getCurrentReturnPath() {
  return sanitizeReturnPath((await headers()).get(CURRENT_PATH_HEADER));
}

export async function getMissingSessionRedirect() {
  return buildLoginRedirect({
    next: await getCurrentReturnPath(),
  });
}

export async function redirectToMissingSession(): Promise<never> {
  redirect(await getMissingSessionRedirect());
}

export async function getExpiredSessionRedirect() {
  const currentPath = await getCurrentReturnPath();

  return buildLogoutRedirect({
    next: currentPath,
    reason: SESSION_EXPIRED_REASON,
  });
}

export async function redirectToExpiredSession(): Promise<never> {
  redirect(await getExpiredSessionRedirect());
}

export async function redirectIfUnauthorized(...results: unknown[]) {
  if (results.some(isUnauthorizedResult)) {
    await redirectToExpiredSession();
  }
}
import "server-only";

import { getCookieValue } from "@/lib/request-cookies";
import { SESSION_USER_COOKIE_NAME } from "@/lib/session-cookies";

export interface SessionUser {
  id: number;
  name: string;
  user_id: string;
}

export function parseSessionUser(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const user = JSON.parse(value) as Record<string, unknown>;
    const id =
      typeof user.id === "number"
        ? user.id
        : typeof user.id === "string"
          ? Number(user.id)
          : Number.NaN;

    if (
      Number.isFinite(id) &&
      typeof user.name === "string" &&
      typeof user.user_id === "string"
    ) {
      return {
        id,
        name: user.name,
        user_id: user.user_id,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function getSessionUser() {
  return parseSessionUser(await getCookieValue(SESSION_USER_COOKIE_NAME));
}

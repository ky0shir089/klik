import "server-only";

import { cookies } from "next/headers";

export const SESSION_USER_COOKIE_NAME = "user";
export const SESSION_ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const SESSION_COOKIE_NAMES = [
  SESSION_USER_COOKIE_NAME,
  SESSION_ACCESS_TOKEN_COOKIE_NAME,
] as const;

const EXPIRED_SESSION_COOKIE_OPTIONS = {
  path: "/",
  expires: new Date(0),
  maxAge: 0,
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

export async function clearSessionCookies() {
  const cookieStore = await cookies();

  for (const name of SESSION_COOKIE_NAMES) {
    cookieStore.set(name, "", EXPIRED_SESSION_COOKIE_OPTIONS);
  }
}

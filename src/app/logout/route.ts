import {
  buildLoginRedirect,
  SESSION_EXPIRED_REASON,
} from "@/lib/auth-redirect";
import { clearSessionCookies } from "@/lib/session-cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await clearSessionCookies();

  const nextPath = request.nextUrl.searchParams.get("next");
  const reason = request.nextUrl.searchParams.get("reason");

  const destination = buildLoginRedirect({
    next: nextPath,
    reason: reason === SESSION_EXPIRED_REASON ? reason : null,
  });

  return NextResponse.redirect(new URL(destination, request.url));
}

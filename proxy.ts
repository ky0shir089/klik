import { NextRequest, NextResponse } from "next/server";
import { CURRENT_PATH_HEADER } from "@/lib/auth-redirect";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname, search } = request.nextUrl;

  requestHeaders.set(CURRENT_PATH_HEADER, `${pathname}${search}`);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};

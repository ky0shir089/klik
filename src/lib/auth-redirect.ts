export const SESSION_EXPIRED_REASON = "session-expired";
export const CURRENT_PATH_HEADER = "x-current-path";
const RETURN_PATH_BASE_URL = "http://localhost";
const ENCODED_PATH_SEPARATOR_PATTERN = /%(?:2f|5c)/i;

function sanitizeReason(reason: string | null | undefined) {
  if (reason === SESSION_EXPIRED_REASON) {
    return reason;
  }

  return null;
}

function isAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/logout" ||
    pathname.startsWith("/logout/")
  );
}

function getSafeDecodedPathname(pathname: string) {
  let decodedPathname = pathname;

  for (let i = 0; i < 10; i += 1) {
    if (
      decodedPathname.includes("\\") ||
      decodedPathname.startsWith("//") ||
      ENCODED_PATH_SEPARATOR_PATTERN.test(decodedPathname)
    ) {
      return null;
    }

    try {
      const nextPathname = decodeURIComponent(decodedPathname);

      if (nextPathname === decodedPathname) {
        return decodedPathname;
      }

      decodedPathname = nextPathname;
    } catch {
      return null;
    }
  }

  if (
    decodedPathname.includes("\\") ||
    decodedPathname.startsWith("//") ||
    ENCODED_PATH_SEPARATOR_PATTERN.test(decodedPathname)
  ) {
    return null;
  }

  return decodedPathname;
}

export function sanitizeReturnPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  const trimmedPath = path.trim();

  if (
    !trimmedPath.startsWith("/") ||
    trimmedPath.startsWith("//") ||
    trimmedPath.includes("\\")
  ) {
    return "/";
  }

  try {
    const url = new URL(trimmedPath, RETURN_PATH_BASE_URL);
    const normalizedPath = `${url.pathname}${url.search}`;
    const decodedPathname = getSafeDecodedPathname(url.pathname);

    if (url.origin !== RETURN_PATH_BASE_URL) {
      return "/";
    }

    if (!decodedPathname || isAuthRoute(decodedPathname)) {
      return "/";
    }

    return normalizedPath || "/";
  } catch {
    return "/";
  }
}

export function buildLoginRedirect(options?: {
  next?: string | null;
  reason?: string | null;
}) {
  const params = new URLSearchParams();

  if (options?.next !== undefined) {
    params.set("next", sanitizeReturnPath(options.next));
  }

  const reason = sanitizeReason(options?.reason);

  if (reason) {
    params.set("reason", reason);
  }

  const queryString = params.toString();

  return queryString ? `/login?${queryString}` : "/login";
}

export function buildLogoutRedirect(options?: {
  next?: string | null;
  reason?: string | null;
}) {
  const params = new URLSearchParams();

  if (options?.next !== undefined) {
    params.set("next", sanitizeReturnPath(options.next));
  }

  const reason = sanitizeReason(options?.reason);

  if (reason) {
    params.set("reason", reason);
  }

  const queryString = params.toString();

  return queryString ? `/logout?${queryString}` : "/logout";
}

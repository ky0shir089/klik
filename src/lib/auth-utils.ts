import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { buildLoginRedirect } from "./auth-redirect";

/**
 * Captures the current URL and redirects to login.
 * Useful for server-side logic when an API returns 401.
 */
export async function redirectToLoginWithMemory(currentPath?: string) {
  const cookieStore = await cookies();
  
  // If path isn't provided, try to detect or use default
  const targetPath = currentPath || '/';
  
  cookieStore.set("last_visited_url", targetPath, { 
    path: "/", 
    maxAge: 3600,
    httpOnly: false, // Ensure client can read this after redirect
    sameSite: 'lax'
  });

  redirect(buildLoginRedirect({ next: targetPath }));
}
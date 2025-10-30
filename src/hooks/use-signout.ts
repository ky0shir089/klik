"use server";

import { cookies } from "next/headers";

export async function useSignOut() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  cookieStore.delete("access_token");
}

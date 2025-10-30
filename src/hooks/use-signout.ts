"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function useSignOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user");
    cookieStore.delete("access_token");
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  } finally {
    redirect("/login");
  }
}

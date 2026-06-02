import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/session-cookies";

export async function POST() {
  await clearSessionCookies();
  return NextResponse.json({ message: "Logged out successfully" });
}

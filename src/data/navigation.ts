"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function navigation() {
  try {
    const { data } = await axiosInstance.get(`/auth/v1/navigation`);

    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type navigationType = Awaited<ReturnType<typeof navigation>>;

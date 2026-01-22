"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function journalIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/gl`, {
      params: {
        page,
        size,
        search,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function journalShow(id: string) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/journal-input/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type journalShowType = Awaited<ReturnType<typeof journalShow>>;

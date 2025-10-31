"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function coaIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/coa`, {
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

export async function coaShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/coa/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type coaShowType = Awaited<ReturnType<typeof coaShow>>;

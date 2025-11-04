"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function bankIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/bank`, {
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

export async function bankShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/bank/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type bankShowType = Awaited<ReturnType<typeof bankShow>>;

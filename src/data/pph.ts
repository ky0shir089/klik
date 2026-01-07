"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function pphIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/pph`, {
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

export async function pphShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/pph/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type pphShowType = Awaited<ReturnType<typeof pphShow>>;

"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function settlementIndex(
  page: number,
  size: number,
  search?: string,
  method?: string,
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/settlement`, {
      params: {
        page,
        size,
        search,
        method,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function settlementShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/settlement/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type settlementShowType = Awaited<ReturnType<typeof settlementShow>>;

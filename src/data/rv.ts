"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function rvIndex(
  page: number,
  size: number,
  search?: string,
  typeTrx?: string,
  method?: string,
  bank?: string
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/rv`, {
      params: {
        page,
        size,
        search,
        type_trx_id: typeTrx,
        method,
        bank_account_id: bank,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function rvShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/rv/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type rvShowType = Awaited<ReturnType<typeof rvShow>>;

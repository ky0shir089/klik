"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function trxDtlIndex(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/trx-dtl`, {
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

export async function trxDtlShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/trx-dtl/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type trxDtlShowType = Awaited<ReturnType<typeof trxDtlShow>>;

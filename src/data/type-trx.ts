"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function typeTrxIndex(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/type-trx`, {
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

export async function typeTrxShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/type-trx/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type typeTrxShowType = Awaited<ReturnType<typeof typeTrxShow>>;

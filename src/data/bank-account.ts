"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function bankAccountIndex(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/bank-account`, {
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

export async function bankAccountShow(id: number) {
  try {
    const { data } = await axiosInstance.get(
      `/accounting/v1/bank-account/${id}`
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type bankAccountShowType = Awaited<ReturnType<typeof bankAccountShow>>;

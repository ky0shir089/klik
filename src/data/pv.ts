"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function pvIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/pv`, {
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

export async function pvShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/pv/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type pvShowType = Awaited<ReturnType<typeof pvShow>>;

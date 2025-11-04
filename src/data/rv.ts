"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function rvIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/rv`, {
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

export async function rvShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/rv/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type rvShowType = Awaited<ReturnType<typeof rvShow>>;

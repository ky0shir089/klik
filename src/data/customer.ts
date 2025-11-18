"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function customerIndex(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/customer`, {
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

export async function customerShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/customer/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type customerShowType = Awaited<ReturnType<typeof customerShow>>;

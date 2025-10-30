"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function roleIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/role`, {
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

export async function roleShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/role/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type roleShowType = Awaited<ReturnType<typeof roleShow>>;

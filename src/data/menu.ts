"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function menuIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/menu`, {
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

export async function menuShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/menu/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type menuShowType = Awaited<ReturnType<typeof menuShow>>;

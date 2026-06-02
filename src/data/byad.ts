"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function byadIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/byad`, {
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

export async function byadShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/byad/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type byadShowType = Awaited<ReturnType<typeof byadShow>>;

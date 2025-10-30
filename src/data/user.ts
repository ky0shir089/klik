"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function userIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/user`, {
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

export async function userShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/setup-aplikasi/v1/user/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type userShowType = Awaited<ReturnType<typeof userShow>>;

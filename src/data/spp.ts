"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function sppIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/spp`, {
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

export async function sppShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/spp/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type sppShowType = Awaited<ReturnType<typeof sppShow>>;

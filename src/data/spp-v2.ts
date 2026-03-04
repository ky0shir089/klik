"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function listSpp(page: number, rows: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/klik/v2/spp`, {
      params: {
        page,
        rows,
        search,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type listSppType = Awaited<ReturnType<typeof listSpp>>[0];

export async function sppDetail(id: number) {
  try {
    const { data } = await axiosInstance.get(`/klik/v2/spp/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type SppDetailType = Awaited<ReturnType<typeof sppDetail>>[0];

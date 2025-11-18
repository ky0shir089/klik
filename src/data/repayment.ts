"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function paymentIndex(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/payment`, {
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

export async function paymentShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/payment/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type paymentShowType = Awaited<ReturnType<typeof paymentShow>>;

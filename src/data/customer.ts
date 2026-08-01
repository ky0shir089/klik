"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function customerIndex(
  page: number,
  size: number,
  tab: string,
  search?: string,
) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/customer`, {
      params: {
        page,
        size,
        tab,
        search,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function vaAuto({
  currentPage,
  size,
  search,
  from_date,
  to_date,
}: {
  currentPage: number;
  size: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}) {
  try {
    const { data } = await axiosInstance.get(`/klik/v1/va-auto`, {
      params: {
        page: currentPage,
        size,
        search,
        from_date,
        to_date,
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

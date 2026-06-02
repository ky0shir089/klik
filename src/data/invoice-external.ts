"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceExternalIndex(
  page: number,
  size: number,
  search?: string,
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/invoice-external`, {
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

export async function invoiceExternalShow(id: number) {
  try {
    const { data } = await axiosInstance.get(
      `/finance/v1/invoice-external/${id}`,
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type invoiceExternalShowType = Awaited<
  ReturnType<typeof invoiceExternalShow>
>;

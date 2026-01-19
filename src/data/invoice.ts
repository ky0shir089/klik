"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceIndex(
  page: number,
  size: number,
  search?: string,
  typeTrx?: string,
  method?: string,
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/invoice`, {
      params: {
        page,
        size,
        search,
        type_trx_id: typeTrx,
        method,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function invoiceInbox(
  page: number,
  size: number,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/invoice-inbox`, {
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

export async function invoiceShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/invoice/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type invoiceShowType = Awaited<ReturnType<typeof invoiceShow>>;

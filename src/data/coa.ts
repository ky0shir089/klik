"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function coaIndex() {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/coa`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function coaShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/accounting/v1/coa/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type coaShowType = Awaited<ReturnType<typeof coaShow>>;

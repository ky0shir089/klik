"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function rvUpdate(id: number) {
  try {
    const { data } = await axiosInstance.put(`/finance/v1/rv/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportRv() {
  try {
    const { data } = await axiosInstance.get(`/report/v1/report-rv`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

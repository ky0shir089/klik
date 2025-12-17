"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportAuction(values: { from: string; to: string }) {
  try {
    const { data } = await axiosInstance.post(
      `/report/v1/report-auction`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

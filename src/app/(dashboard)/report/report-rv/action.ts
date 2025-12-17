"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportRv() {
  try {
    const { data } = await axiosInstance.get(`/report/v1/report-rv`);

    // const file = new File([response.data], "export.xlsx", {
    //   type: response.headers["content-type"] || "application/octet-stream",
    // });

    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

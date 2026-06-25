"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportRv(values: {
  from: string;
  to: string;
  type: string;
}) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-rv`, values, {
      responseType: "arraybuffer",
    });

    const fileName = `report-rv-titipan-${values.from}-to-${values.to}.xlsx`;
    const file = new File([res.data], fileName, {
      type:
        typeof res.headers["content-type"] === "string"
          ? res.headers["content-type"]
          : "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}

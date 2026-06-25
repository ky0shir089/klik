"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function sppInbox(id: number) {
  try {
    const { data } = await axiosInstance.post(`/klik/v1/spp-inbox`, {
      invoice_no: id,
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type sppInboxType = Awaited<ReturnType<typeof sppInbox>>;

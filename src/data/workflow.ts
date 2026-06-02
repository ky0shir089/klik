"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function workflowIndex(page: number, size: number, search?: string) {
  try {
    const { data } = await axiosInstance.get(`/workflow/v1/workflow`, {
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

export async function workflowShow(id: number) {
  try {
    const { data } = await axiosInstance.get(`/workflow/v1/workflow/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export type workflowShowType = Awaited<ReturnType<typeof workflowShow>>;

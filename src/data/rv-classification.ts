"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function rvClassificationIndex(
  page: number,
  size: number,
  diff: string,
  search?: string
) {
  try {
    const { data } = await axiosInstance.get(`/finance/v1/rv-classification`, {
      params: {
        page,
        size,
        diff,
        search,
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function rvClassificationShow(id: number) {
  try {
    const { data } = await axiosInstance.get(
      `/finance/v1/rv-classification/${id}`
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type rvClassificationShowType = Awaited<
  ReturnType<typeof rvClassificationShow>
>;

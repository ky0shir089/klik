"use server";

import axiosInstance from "@/lib/axios";
import { executeApiCall } from "@/lib/execute-api";

export async function rvUpdate(id: number) {
  return executeApiCall(() => axiosInstance.put(`/finance/v1/rv/${id}`).then(r => r.data));
}

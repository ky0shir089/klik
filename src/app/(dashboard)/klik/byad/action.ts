"use server";

import axiosInstance from "@/lib/axios";
import { byadSchema, byadSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function byadStore(values: byadSchemaType) {
  const validation = byadSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };

  const formData = new FormData();
  formData.append("date", values.date);
  formData.append("branch", values.branch);
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  formData.append("details", JSON.stringify(values.details));

  return executeApiCall(() => axiosInstance.post(`/klik/v1/byad`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(r => r.data));
}

export async function byadUpdate(id: number, values: byadSchemaType) {
  const validation = byadSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };

  const formData = new FormData();
  formData.append("date", values.date);
  formData.append("branch", values.branch);
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  formData.append("details", JSON.stringify(values.details));

  return executeApiCall(() => axiosInstance.post(
    `/klik/v1/byad/${id}?_method=PUT`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  ).then(r => r.data));
}

export async function byadDelete(id: number) {
  return executeApiCall(() => axiosInstance.delete(`/klik/v1/byad/${id}`).then(r => r.data));
}

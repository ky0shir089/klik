"use server";

import axiosInstance from "@/lib/axios";
import { byadSchema, byadSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function byadStore(values: byadSchemaType) {
  const validation = byadSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("date", values.date);
  formData.append("branch", values.branch);
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  formData.append("details", JSON.stringify(values.details));

  try {
    const { data } = await axiosInstance.post(`/klik/v1/byad`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function byadUpdate(id: number, values: byadSchemaType) {
  const validation = byadSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("date", values.date);
  formData.append("branch", values.branch);
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  formData.append("details", JSON.stringify(values.details));

  try {
    const { data } = await axiosInstance.post(
      `/klik/v1/byad/${id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function byadDelete(id: number) {
  try {
    const { data } = await axiosInstance.delete(`/klik/v1/byad/${id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

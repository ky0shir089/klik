"use server";

import axiosInstance from "@/lib/axios";
import { bankSchema, bankSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function bankStore(values: bankSchemaType) {
  const validation = bankSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("name", values.name);
  if (values.logo) {
    formData.append("logo", values.logo);
  }

  try {
    const { data } = await axiosInstance.post(`/accounting/v1/bank`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function bankUpdate(id: number, values: bankSchemaType) {
  const validation = bankSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("name", values.name);
  if (values.logo) {
    formData.append("logo", values.logo);
  }

  try {
    const { data } = await axiosInstance.post(
      `/accounting/v1/bank/${id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

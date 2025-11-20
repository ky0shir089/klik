"use server";

import axiosInstance from "@/lib/axios";
import {
  paymentSchema,
  paymentSchemaType,
  uploadFileSchema,
  uploadFileSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function paymentStore(values: paymentSchemaType) {
  const validation = paymentSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/payment`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function uploadDataUnit(values: uploadFileSchemaType) {
  const validation = uploadFileSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  const formData = new FormData();
  if (values.file) {
    formData.append("file", values.file);
  }

  try {
    const { data } = await axiosInstance.post(
      `/klik/v1/upload-data-unit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    revalidatePath(`/klik/payment/${values.id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

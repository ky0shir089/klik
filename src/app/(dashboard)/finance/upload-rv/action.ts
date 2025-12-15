"use server";

import axiosInstance from "@/lib/axios";
import { uploadFileSchema, uploadFileSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function uploadRv(values: uploadFileSchemaType) {
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
      `/finance/v1/upload-rv`,
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

export async function uploadRv2(values: uploadFileSchemaType) {
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
      `/finance/v2/upload-rv`,
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

"use server";

import axiosInstance from "@/lib/axios";
import { uploadFileSchema, uploadFileSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function uploadSpp(values: uploadFileSchemaType) {
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
    const { data } = await axiosInstance.post(`/klik/v1/upload-spp`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

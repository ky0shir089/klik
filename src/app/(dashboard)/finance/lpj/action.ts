"use server";

import axiosInstance from "@/lib/axios";
import { lpjSchema, lpjSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function lpjStore(values: lpjSchemaType) {
  const validation = lpjSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("date", values.date);
  if (values.trx_id !== null) {
    formData.append("trx_id", values.trx_id.toString());
  }
  formData.append("payment_method", values.payment_method);
  if (values.pv_id) {
    formData.append("pv_id", values.pv_id.toString());
  }
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("details", JSON.stringify(values.details));

  try {
    const { data } = await axiosInstance.post(
      `/finance/v1/settlement`,
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

export async function lpjUpdate(id: number, values: lpjSchemaType) {
  const validation = lpjSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("date", values.date);
  if (values.trx_id !== null) {
    formData.append("trx_id", values.trx_id.toString());
  }
  formData.append("payment_method", values.payment_method);
  if (values.pv_id) {
    formData.append("pv_id", values.pv_id.toString());
  }
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("details", JSON.stringify(values.details));

  try {
    const { data } = await axiosInstance.post(
      `/finance/v1/settlement/${id}?_method=PUT`,
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

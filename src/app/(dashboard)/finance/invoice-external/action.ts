"use server";

import axiosInstance from "@/lib/axios";
import {
  invoiceExternalSchema,
  invoiceExternalSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceExternalStore(values: invoiceExternalSchemaType) {
  const validation = invoiceExternalSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const formData = new FormData();
  formData.append("date", values.date);
  formData.append("due_date", values.due_date.toString());
  if (values.supplier_id !== null) {
    formData.append("supplier_id", values.supplier_id.toString());
  }
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  values.units.forEach((unitId) => {
    formData.append("units[]", unitId.toString());
  });

  try {
    const { data } = await axiosInstance.post(
      `/finance/v1/invoice-external`,
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

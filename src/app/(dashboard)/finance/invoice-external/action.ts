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
  formData.append("signatory", values.signatory);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  formData.append("status", values.status);
  formData.append("from_date", values.from_date!);
  formData.append("to_date", values.to_date!);
  formData.append("total_amount_manual", values.total_amount_manual.toString());
  if (values.units !== null) {
    values.units.forEach((unitId) => {
      formData.append("units[]", unitId.toString());
    });
  }

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

export async function memo(id: number) {
  try {
    const response = await axiosInstance.get(
      `/finance/v1/memo-external/${id}`,
      {
        responseType: "arraybuffer",
      },
    );

    const file = new File([response.data], "export.pdf", {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function downloadListUnit(fromDate: string, toDate: string) {
  try {
    const response = await axiosInstance.post(
      `/report/v1/list-unit-pelunasan`,
      { from: fromDate, to: toDate },
      {
        responseType: "arraybuffer",
      },
    );

    const file = new File([response.data], "list-unit.xlsx", {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function invoiceExternalReject(id: number) {
  try {
    const { data } = await axiosInstance.put(
      `/finance/v1/invoice-external/${id}`,
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

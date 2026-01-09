"use server";

import axiosInstance from "@/lib/axios";
import { invoiceSchema, invoiceSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceStore(values: invoiceSchemaType) {
  const validation = invoiceSchema.safeParse(values);

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
  if (values.supplier_id !== null) {
    formData.append("supplier_id", values.supplier_id.toString());
  }
  formData.append("payment_method", values.payment_method);
  if (values.supplier_account_id !== null) {
    formData.append(
      "supplier_account_id",
      values.supplier_account_id.toString()
    );
  }
  formData.append("description", values.description);
  if (values.attachment) {
    formData.append("attachment", values.attachment);
  }
  values.details.forEach((item, i) => {
    formData.append(`details[${i}][inv_coa_id]`, item.inv_coa_id.toString());
    formData.append(`details[${i}][description]`, item.description);
    if (item.item_amount !== null) {
      formData.append(
        `details[${i}][item_amount]`,
        item.item_amount.toString()
      );
    }
    if (item.pph_id !== null) {
      formData.append(`details[${i}][pph_id]`, item.pph_id.toString());
    }
    formData.append(`details[${i}][ppn_rate]`, item.ppn_rate.toString());
    formData.append(`details[${i}][pph_amount]`, item.pph_amount.toString());
    formData.append(`details[${i}][ppn_rate]`, item.ppn_rate.toString());
    formData.append(`details[${i}][ppn_amount]`, item.ppn_amount.toString());
    if (item.rv_id !== null) {
      formData.append(`details[${i}][rv_id]`, item.rv_id.toString());
    }
  });

  try {
    const { data } = await axiosInstance.post(`/finance/v1/invoice`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

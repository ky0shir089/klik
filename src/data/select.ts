"use server";

import axiosInstance from "@/lib/axios";

export async function selectModule() {
  const { data } = await axiosInstance.get(`/select/v1/module`);
  return data;
}

export async function selectMenuPermission() {
  const { data } = await axiosInstance.get(`/select/v1/menu-permission`);
  return data;
}

export async function selectRole() {
  const { data } = await axiosInstance.get(`/select/v1/role`);
  return data;
}

export async function selectCoa(type: string) {
  const { data } = await axiosInstance.get(`/select/v1/coa`, {
    params: {
      type,
    },
  });
  return data;
}

export async function selectBank() {
  const { data } = await axiosInstance.get(`/select/v1/bank`);
  return data;
}

export async function selectTypeTrx(in_out?: string) {
  const { data } = await axiosInstance.get(`/select/v1/type-trx`, {
    params: {
      in_out,
    },
  });
  return data;
}

export async function selectBankAccount() {
  const { data } = await axiosInstance.get(`/select/v1/bank-account`);
  return data;
}

export async function selectTitipanPelunasan(
  page: number,
  size: number,
  search?: string
) {
  const { data } = await axiosInstance.get(`/select/v1/titipan-pelunasan`, {
    params: {
      page,
      size,
      search,
    },
  });
  return data;
}

export async function selectUnpaidBidder(
  page: number,
  size: number,
  search?: string
) {
  const { data } = await axiosInstance.get(`/select/v1/unpaid-bidder`, {
    params: {
      page,
      size,
      search,
    },
  });
  return data;
}

export async function selectUnpaidPayment() {
  const { data } = await axiosInstance.get(`/select/v1/unpaid-payment`);
  return data;
}

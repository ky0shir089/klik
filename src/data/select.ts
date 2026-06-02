"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

async function selectRequest(
  url: string,
  params?: Record<string, string | number | undefined>,
) {
  try {
    const { data } = await axiosInstance.get(url, { params });
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function selectModule() {
  return selectRequest(`/select/v1/module`);
}

export async function selectMenuPermission() {
  return selectRequest(`/select/v1/menu-permission`);
}

export async function selectRole() {
  return selectRequest(`/select/v1/role`);
}

export async function selectCoa(type?: string) {
  return selectRequest(`/select/v1/coa`, {
    type,
  });
}

export async function selectBank() {
  return selectRequest(`/select/v1/bank`);
}

export async function selectTypeTrx(in_out?: string) {
  return selectRequest(`/select/v1/type-trx`, {
    in_out,
  });
}

export async function selectBankAccount() {
  return selectRequest(`/select/v1/bank-account`);
}

export async function selectTitipanPelunasan(
  page: number,
  size: number,
  search?: string,
) {
  return selectRequest(`/select/v1/titipan-pelunasan`, {
    page,
    size,
    search,
  });
}

export async function selectUnpaidBidder(
  page: number,
  size: number,
  search?: string,
) {
  return selectRequest(`/select/v1/unpaid-bidder`, {
    page,
    size,
    search,
  });
}

export async function selectUnpaidPayment(method?: string) {
  return selectRequest(`/select/v1/unpaid-payment`, {
    method,
  });
}

export async function selectSupplier() {
  return selectRequest(`/select/v1/supplier`);
}

export async function selectPph() {
  return selectRequest(`/select/v1/pph`);
}

export async function selectRv(page: number, size: number, search?: string) {
  return selectRequest(`/select/v1/rv`, {
    page,
    size,
    search,
  });
}

export async function selectByadUnit(
  branch_name: string,
  from_date?: string,
  to_date?: string,
) {
  return selectRequest(`/select/v1/byad-unit`, {
    branch_name,
    from_date,
    to_date,
  });
}

export async function selectBranch() {
  return selectRequest(`/select/v1/branch`);
}
export type branchShowType = Awaited<ReturnType<typeof selectBranch>>;

export async function selectByad(page: number, size: number) {
  return selectRequest(`/select/v1/byad`, {
    page,
    size,
  });
}

export async function selectUser() {
  return selectRequest(`/select/v1/user`);
}

export async function selectPrepayment() {
  return selectRequest(`/select/v1/prepayment`);
}

export async function selectPaidOffUnit(
  page: number,
  size: number,
  search?: string,
  from_date?: string,
  to_date?: string,
) {
  return selectRequest(`/select/v1/paid-off-unit`, {
    page,
    size,
    from_date,
    to_date,
    search,
  });
}

export async function selectMoneyInTransit() {
  return selectRequest(`/select/v1/money-in-transit`);
}

export async function selectExternal() {
  return selectRequest(`/select/v1/external`);
}

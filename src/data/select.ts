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

export async function selectCoa() {
  const { data } = await axiosInstance.get(`/select/v1/coa`);
  return data;
}

import axios from "axios";

export async function parseAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return { isUnauthorized: true };
    }
    if (error.response?.status === 403) {
      return { isForbidden: true };
    }
    if (error.response?.status === 404) {
      return { isNotFound: true };
    }
    return error.response?.data || error.message;
  }
  return "Unknown error";
}

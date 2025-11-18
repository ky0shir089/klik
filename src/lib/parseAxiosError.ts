import axios from "axios";

export async function parseAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return { isUnauthorized: true, message: error.response.data.message };
    }
    if (error.response?.status === 403) {
      return { isForbidden: true, message: error.response.data.message };
    }
    if (error.response?.status === 404) {
      return { isNotFound: true, message: error.response.data.message };
    }
    return error.response?.data || error.message;
  }
  return "Unknown error";
}

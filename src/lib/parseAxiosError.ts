import axios from "axios";

function getErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

export function parseAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = getErrorMessage(error.response?.data, error.message);

    if (status === 401) {
      return { isUnauthorized: true, message };
    }
    if (status === 403) {
      return { isForbidden: true, message };
    }
    if (status === 404) {
      return { isNotFound: true, message };
    }

    if (error.response?.data) {
      return error.response.data;
    }

    return { success: false, message };
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

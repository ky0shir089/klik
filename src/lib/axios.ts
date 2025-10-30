import axios from "axios";
import { env } from "./env";
import { cookies } from "next/headers";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL: `${env.BASE_URL}/api`,
  withCredentials: true,
  headers,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token.value)}`;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

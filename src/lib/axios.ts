import axios from "axios";
import { env } from "./env";
import { getCookieData } from "./cookieData";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL: `${env.API_URL}`,
  withCredentials: true,
  headers,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getCookieData("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

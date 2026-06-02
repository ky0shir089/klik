import "server-only";

import axios from "axios";
import { env } from "./env";
import { getCookieValue } from "./request-cookies";
import { SESSION_ACCESS_TOKEN_COOKIE_NAME } from "./session-cookies";

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
      const token = await getCookieValue(SESSION_ACCESS_TOKEN_COOKIE_NAME);

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

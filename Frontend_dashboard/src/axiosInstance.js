import { apiKey } from "./utils/helper";
import Cookies from "js-cookie";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: apiKey,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
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
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

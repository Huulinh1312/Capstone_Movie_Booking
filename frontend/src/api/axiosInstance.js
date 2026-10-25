import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3069/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const accessToken = user.accessToken || user.data?.accessToken;
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    } catch {
      localStorage.removeItem("user");
    }
  }

  return config;
});

export default axiosInstance;

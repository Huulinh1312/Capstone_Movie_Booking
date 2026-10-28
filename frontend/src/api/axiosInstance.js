import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://capstone-movie-booking.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return config;

  try {
    const user = JSON.parse(storedUser);
    const token = user.accessToken || user.data?.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    localStorage.removeItem("user");
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isAuthRequest = requestUrl.includes("/DangNhap") || requestUrl.includes("/DangKy");
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login?session=expired");
      }
    }
    return Promise.reject(error);
  },
);

export function getAssetUrl(path) {
  if (!path) return "";
  if (/^data:image\//i.test(path)) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export default axiosInstance;

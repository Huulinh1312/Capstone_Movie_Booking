import axiosInstance from "./axiosInstance";

export const authApi = {
  login: (data) => axiosInstance.post("/QuanLyNguoiDung/DangNhap", data),
  register: (data) => axiosInstance.post("/QuanLyNguoiDung/DangKy", data),
  getRoles: () => axiosInstance.get("/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung"),
};

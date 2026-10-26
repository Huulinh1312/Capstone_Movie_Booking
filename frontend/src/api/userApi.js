import axiosInstance from "./axiosInstance";

export const userApi = {
  getProfile: () => axiosInstance.post("/QuanLyNguoiDung/ThongTinTaiKhoan"),
  getList: (groupCode = "GP01") =>
    axiosInstance.get("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params: { MaNhom: groupCode },
    }),
  getListPaginated: (groupCode = "GP01", page = 1, size = 10) =>
    axiosInstance.get("/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang", {
      params: { MaNhom: groupCode, soTrang: page, soPhanTuTrenTrang: size },
    }),
  search: (keyword = "") =>
    axiosInstance.get("/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: { tuKhoa: keyword },
    }),
  getByAccount: (account) =>
    axiosInstance.post("/QuanLyNguoiDung/LayThongTinNguoiDung", null, {
      params: { taiKhoan: account },
    }),
  add: (payload) => axiosInstance.post("/QuanLyNguoiDung/ThemNguoiDung", payload),
  update: (payload) =>
    axiosInstance.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload),
  remove: (account) =>
    axiosInstance.delete("/QuanLyNguoiDung/XoaNguoiDung", {
      params: { TaiKhoan: account },
    }),
};

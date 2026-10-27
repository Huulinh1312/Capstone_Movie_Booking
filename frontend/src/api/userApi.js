import axiosInstance from "./axiosInstance";

export const userApi = {
  getProfile: () => axiosInstance.post("/QuanLyNguoiDung/ThongTinTaiKhoan"),
  getList: (groupCode = "GP01") =>
    axiosInstance.get("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params: { MaNhom: groupCode },
    }),
  getListPaginated: (groupCode = "GP01", page = 1, size = 10) =>
    axiosInstance.get("/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang", {
      params: { maNhom: groupCode, soTrang: page, soPhanTuTrenTrang: size },
    }),
  search: (keyword = "") =>
    axiosInstance.get("/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: { tuKhoa: keyword },
    }),
  searchPaginated: (keyword = "", groupCode = "GP01", page = 1, size = 10) =>
    axiosInstance.get("/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang", {
      params: {
        MaNhom: groupCode,
        tuKhoa: keyword,
        soTrang: page,
        soPhanTuTrenTrang: size,
      },
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

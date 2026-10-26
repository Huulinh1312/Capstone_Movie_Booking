import axiosInstance from "./axiosInstance";

export const movieApi = {
  getMovieList: (groupCode = "GP01") =>
    axiosInstance.get("/QuanLyPhim/LayDanhSachPhim", { params: { maNhom: groupCode } }),
  getMovieDetail: (id) =>
    axiosInstance.get("/QuanLyPhim/LayThongTinPhim", { params: { maPhim: id } }),
  getBanners: () => axiosInstance.get("/QuanLyPhim/LayDanhSachBanner"),
  getMovieListPhanTrang: (groupCode = "GP01", page = 1, size = 10) =>
    axiosInstance.get("/QuanLyPhim/LayDanhSachPhimPhanTrang", {
      params: { MaNhom: groupCode, soTrang: page, soPhanTuTrenTrang: size },
    }),
  getMoviesByDate: (from, to, page = 1, size = 10, groupCode = "GP01") =>
    axiosInstance.get("/QuanLyPhim/LayDanhSachPhimTheoNgay", {
      params: { tuNgay: from, denNgay: to, soTrang: page, soPhanTuTrenTrang: size, maNhom: groupCode },
    }),
  addMovieWithImage: (formData) =>
    axiosInstance.post("/QuanLyPhim/ThemPhimUploadHinh", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateMovieWithImage: (formData) =>
    axiosInstance.post("/QuanLyPhim/CapNhatPhimUpload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMovie: (id) =>
    axiosInstance.delete("/QuanLyPhim/XoaPhim", { params: { MaPhim: id } }),
};

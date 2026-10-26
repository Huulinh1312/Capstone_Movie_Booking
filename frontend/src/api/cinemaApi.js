import axiosInstance from "./axiosInstance";

export const cinemaApi = {
  getHeThongRap: () => axiosInstance.get("/QuanLyRap/LayThongTinHeThongRap"),
  getCumRapTheoHeThong: (code) =>
    axiosInstance.get("/QuanLyRap/LayThongTinCumRapTheoHeThong", {
      params: { maHeThongRap: code },
    }),
  getLichChieuHeThongRap: (code, groupCode = "GP01") =>
    axiosInstance.get("/QuanLyRap/LayThongTinLichChieuHeThongRap", {
      params: { maHeThongRap: code, maNhom: groupCode },
    }),
  getLichChieuPhim: (movieId) =>
    axiosInstance.get("/QuanLyRap/LayThongTinLichChieuPhim", {
      params: { MaPhim: movieId },
    }),
};

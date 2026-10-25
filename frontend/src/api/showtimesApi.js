import axiosInstance from "./axiosInstance";

export const showtimesApi = {
  // Lấy thông tin lịch chiếu theo hệ thống rạp
  getShowtimesBySystem: (maNhom = "GP01") => {
    return axiosInstance.get(
      `/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${maNhom}`
    );
  },

  // Lấy danh sách hệ thống rạp
  getCinemaSystems: () => {
    return axiosInstance.get(`/QuanLyRap/LayThongTinHeThongRap`);
  },

  // Lấy danh sách cụm rạp theo hệ thống
  getCinemasBySystem: (maHeThongRap) => {
    return axiosInstance.get(
      `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
    );
  },

  // Lấy lịch chiếu của một phim
  getShowtimesByMovie: (maPhim) => {
    return axiosInstance.get(
      `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`
    );
  },
  
  // Tạo lịch chiếu (payload: { maPhim, ngayChieuGioChieu, maRap, giaVe, maNhom })
  createShowtime: (lich) => {
    return axiosInstance.post(`/QuanLyDatVe/TaoLichChieu`, lich);
  },
};
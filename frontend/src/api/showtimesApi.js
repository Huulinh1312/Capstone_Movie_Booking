import axiosInstance from "./axiosInstance";

export const showtimesApi = {
  createShowtime: (payload) =>
    axiosInstance.post("/QuanLyDatVe/TaoLichChieu", payload),
};

export const bookingApi = {
  getHistory: () => axiosInstance.get("/QuanLyDatVe/LayLichSuDatVe"),
  deleteHistory: (bookingId) =>
    axiosInstance.delete("/QuanLyDatVe/XoaLichSuDatVe", {
      params: { bookingId },
    }),
  getSeats: (showtimeId) =>
    axiosInstance.get("/QuanLyDatVe/LayDanhSachPhongVe", {
      params: { MaLichChieu: showtimeId },
    }),
  book: (showtimeId, seats) =>
    axiosInstance.post("/QuanLyDatVe/DatVe", {
      maLichChieu: Number(showtimeId),
      danhSachVe: seats.map((seat) => ({
        maGhe: Number(seat.id),
        giaVe: Number(seat.price || seat.giaVe || 90000),
      })),
    }),
};

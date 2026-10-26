import axiosInstance from "./axiosInstance";

export const showtimesApi = {
  createShowtime: (payload) =>
    axiosInstance.post("/QuanLyDatVe/TaoLichChieu", payload),
};

export const bookingApi = {
  getSeats: (showtimeId) =>
    axiosInstance.get("/QuanLyDatVe/LayDanhSachPhongVe", {
      params: { MaLichChieu: showtimeId },
    }),
  book: (showtimeId, seats) =>
    axiosInstance.post("/QuanLyDatVe/DatVe", {
      maLichChieu: Number(showtimeId),
      danhSachVe: seats.map((seat) => ({
        maGhe: Number(seat.id),
        giaVe: Number(seat.price || 0),
      })),
    }),
};

import { createSlice } from "@reduxjs/toolkit";
import danhSachGhe from "../../data/danhSachGhe";

const initialState = {
  danhSachGhe,
  gheKhachChon: [],
  thongTinPhim: null, 
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    // chọn / bỏ chọn ghế
    chonGhe: (state, action) => {
      const gheDuocChon = action.payload;

      const index = state.gheKhachChon.findIndex(
        (g) => g.soGhe === gheDuocChon.soGhe
      );

      if (index === -1) {
        state.gheKhachChon.push(gheDuocChon);
      } else {
        state.gheKhachChon.splice(index, 1);
      }
    },

    // hủy ghế
    huyGhe: (state, action) => {
      const soGhe = action.payload;

      state.gheKhachChon = state.gheKhachChon.filter(
        (g) => g.soGhe !== soGhe
      );
    },

    //Load danh sách ghế 
    loadDanhSachGhe: (state, action) => {
      state.danhSachGhe = action.payload;
      state.gheKhachChon = [];
    },

    // đặt vé
    datVe: (state) => {
      state.danhSachGhe.forEach((hang) => {
        hang.danhSachGhe.forEach((ghe) => {
          const daChon = state.gheKhachChon.find(
            (item) => item.soGhe === ghe.soGhe
          );

          if (daChon) {
            ghe.daDat = true;
          }
        });
      });

      // Prepare booking record to store in localStorage booking history
      try {
        const bookingInfo = state.thongTinPhim || {};
        const bookedSeats = state.gheKhachChon.map((s) => ({ ...s }));
        const total = bookedSeats.reduce((sum, s) => sum + (s.gia || 0), 0);

        const ticket = {
          id: `bk_${Date.now()}`,
          maPhim: bookingInfo.maPhim || null,
          tenPhim: bookingInfo.tenPhim || "",
          tenCumRap: bookingInfo.tenCumRap || bookingInfo.tenRap || "",
          tenRap: bookingInfo.tenRap || "",
          ngayChieu: bookingInfo.ngayChieu || new Date().toLocaleDateString(),
          gioChieu: bookingInfo.gioChieu || new Date().toLocaleTimeString(),
          hinhAnh: bookingInfo.hinhAnh || null,
          maVe: `#${Math.floor(Math.random() * 900000) + 100000}`,
          seats: bookedSeats,
          total,
          createdAt: new Date().toISOString(),
        };

        const key = "bookingHistory";
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.unshift(ticket);
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (err) {
        // ignore localStorage errors
      }

      state.gheKhachChon = [];
    },

    // 👇 SET THÔNG TIN PHIM + SUẤT CHIẾU
    setThongTinPhim: (state, action) => {
      state.thongTinPhim = action.payload;
    },
  },
});

// actions
export const {
  chonGhe,
  huyGhe,
  datVe,
  setThongTinPhim,
  loadDanhSachGhe,
} = bookingSlice.actions;

// selectors
export const selectorDanhSachGhe = (state) =>
  state.booking.danhSachGhe;

export const selectorGheKhachChon = (state) =>
  state.booking.gheKhachChon;

export const selectorThongTinPhim = (state) =>
  state.booking.thongTinPhim;

export default bookingSlice.reducer;
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  selectorGheKhachChon,
  huyGhe,
  datVe,
  selectorThongTinPhim,
  selectorDanhSachGhe,
} from "../store/booking/bookingSlice";

const DanhsachGheDaChon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gheKhachChon = useSelector(selectorGheKhachChon);
  const bookingInfo = useSelector(selectorThongTinPhim);
  const danhSachGhe = useSelector(selectorDanhSachGhe);

  // Lưu danh sách ghế theo từng suất chiếu
  useEffect(() => {
    if (!bookingInfo) return;

    const key = `seat_${bookingInfo.maPhim}_${bookingInfo.tenRap}_${bookingInfo.ngayChieu}_${bookingInfo.gioChieu}`;

    localStorage.setItem(key, JSON.stringify(danhSachGhe));
  }, [danhSachGhe, bookingInfo]);

  // Xử lý đặt vé
  const handleDatVe = () => {
    // ==============================
    // 1. KIỂM TRA ĐĂNG NHẬP
    // ==============================
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (!token) {
      alert("⚠️ Vui lòng đăng nhập để đặt vé!");

      // Chuyển đến trang đăng nhập
      navigate("/login");

      return;
    }

    // ==============================
    // 2. KIỂM TRA ĐÃ CHỌN GHẾ CHƯA
    // ==============================
    if (gheKhachChon.length === 0) {
      alert("⚠️ Vui lòng chọn ghế!");
      return;
    }

    // ==============================
    // 3. ĐẶT VÉ
    // ==============================
    dispatch(datVe());

    alert("🎉 Đặt vé thành công!");
  };

  // Tính tổng tiền
  const tongTien = gheKhachChon.reduce((tong, ghe) => tong + ghe.gia, 0);

  return (
    <aside className="w-full xl:w-[360px] 2xl:w-[390px] flex flex-col gap-5">
      {/* ==============================
          MOVIE INFO
      ============================== */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-black/80 shadow-xl">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${bookingInfo?.hinhAnh || "/bgmovie.jpg"})`,
            opacity: 0.45,
            filter: "brightness(.7)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/80 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-5 lg:p-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
            {bookingInfo?.tenPhim || "Loading..."}
          </h2>

          <p className="mt-1 text-orange-400 uppercase tracking-widest text-[11px] font-semibold">
            {bookingInfo?.tenRap || "STANDARD"}
          </p>

          <div className="mt-6 space-y-4">
            {/* Rạp */}
            <div className="flex gap-3">
              <i className="fa-solid fa-location-dot text-orange-400 mt-1" />

              <div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {bookingInfo?.tenCumRap || "Chưa chọn rạp"}
                </p>

                <span className="text-xs text-gray-400">Screen</span>
              </div>
            </div>

            {/* Ngày chiếu */}
            <div className="flex gap-3">
              <i className="fa-regular fa-calendar text-orange-400 mt-1" />

              <div>
                <p className="text-white text-sm sm:text-base font-medium">
                  {bookingInfo?.ngayChieu || "N/A"}
                </p>

                <span className="text-xs text-gray-400">
                  {bookingInfo?.gioChieu || "00:00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================
          SELECTED SEATS
      ============================== */}
      <div className="rounded-2xl border border-orange-500/20 bg-black/85 shadow-xl">
        <div className="p-4 sm:p-5 lg:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-white/10 pb-4">
            Ghế của bạn
          </h3>

          <div className="mt-4 space-y-3 max-h-[180px] sm:max-h-[240px] lg:max-h-[320px] overflow-y-auto pr-1">
            {gheKhachChon.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">
                  Chưa có ghế nào được chọn
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Vui lòng chọn ghế bên trái
                </p>
              </div>
            ) : (
              gheKhachChon.map((ghe) => (
                <div
                  key={ghe.soGhe}
                  className="flex items-center justify-between rounded-xl border border-orange-500/10 bg-[#171717] p-3 hover:border-orange-500/40 transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Số ghế */}
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-xs sm:text-sm font-bold text-orange-400">
                      {ghe.soGhe}
                    </div>

                    <span className="text-xs sm:text-sm text-gray-300">
                      Standard
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Giá */}
                    <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                      {ghe.gia.toLocaleString()} ₫
                    </span>

                    {/* Hủy ghế */}
                    <button
                      type="button"
                      onClick={() => dispatch(huyGhe(ghe.soGhe))}
                      className="text-gray-500 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ==============================
              TOTAL
          ============================== */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[3px] text-gray-500">
                  Tổng cộng
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {gheKhachChon.length} ghế đã chọn
                </p>
              </div>

              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500">
                {tongTien.toLocaleString()} ₫
              </span>
            </div>

            {/* ==============================
                BUTTON ĐẶT VÉ
            ============================== */}
            <button
              type="button"
              onClick={handleDatVe}
              className="
                mt-5
                w-full
                rounded-xl
                bg-orange-500
                py-3
                text-sm
                sm:text-base
                font-semibold
                text-white
                transition
                hover:bg-orange-600
                active:scale-[0.98]
                shadow-lg
                shadow-orange-500/30
              "
            >
              Đặt vé
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DanhsachGheDaChon;

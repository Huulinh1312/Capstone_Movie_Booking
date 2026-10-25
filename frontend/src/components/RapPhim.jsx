import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectorDanhSachGhe } from "../store/booking/bookingSlice";
import {
  chonGhe,
  selectorGheKhachChon,
  selectorThongTinPhim,
  loadDanhSachGhe,
} from "../store/booking/bookingSlice";
import danhSachGheMacDinh from "../data/danhSachGhe";

const RapPhim = () => {
  const dispatch = useDispatch();

  const danhSachGhe = useSelector(selectorDanhSachGhe);
  const gheKhachChon = useSelector(selectorGheKhachChon);
  const bookingInfo = useSelector(selectorThongTinPhim);

  useEffect(() => {
    if (!bookingInfo) return;

    const key = `seat_${bookingInfo.maPhim}_${bookingInfo.tenRap}_${bookingInfo.ngayChieu}_${bookingInfo.gioChieu}`;

    const savedSeats = JSON.parse(localStorage.getItem(key));

    dispatch(loadDanhSachGhe(savedSeats || danhSachGheMacDinh));
  }, [bookingInfo, dispatch]);

  const renderHeaderGhe = () => {
    const headerData = danhSachGhe.find((item) => item.hang === "");

    if (!headerData) return null;

    return headerData.danhSachGhe.map((ghe) => (
      <div
        key={ghe.soGhe}
        className="
        flex items-center justify-center
        text-[9px]
        sm:text-[10px]
        lg:text-xs
        font-semibold
        text-gray-300
      "
      >
        {ghe.soGhe}
      </div>
    ));
  };

  const renderGhe = () => {
    return danhSachGhe.map((hang, index) => {
      if (hang.hang === "") return null;

      return (
        <div
          key={index}
          className="
          grid
          grid-cols-[22px_repeat(12,24px)]
          sm:grid-cols-[28px_repeat(12,30px)]
          md:grid-cols-[32px_repeat(12,34px)]
          lg:grid-cols-[36px_repeat(12,38px)]
          gap-1
          sm:gap-2
          mb-2
        "
        >
          {/* Tên hàng */}
          <div className="flex items-center justify-center font-bold text-orange-500 text-[11px] sm:text-sm lg:text-base">
            {hang.hang}
          </div>

          {hang.danhSachGhe.map((ghe, gheIndex) => {
            const dangChon = gheKhachChon.some((g) => g.soGhe === ghe.soGhe);

            let classGhe =
              "flex items-center justify-center rounded-lg border transition-all duration-300";

            if (ghe.daDat) {
              classGhe += " bg-gray-300 border-gray-300 cursor-not-allowed";
            } else if (dangChon) {
              classGhe +=
                " bg-orange-500 border-orange-300 shadow-[0_0_12px_rgba(249,115,22,.6)]";
            } else {
              classGhe +=
                " bg-black/60 border-gray-500 hover:border-orange-500 hover:bg-orange-500/20";
            }

            return (
              <button
                key={gheIndex}
                disabled={ghe.daDat}
                onClick={() => dispatch(chonGhe(ghe))}
                className={`
                ${classGhe}

                w-6
                h-6

                sm:w-8
                sm:h-8

                md:w-[34px]
                md:h-[34px]

                lg:w-[38px]
                lg:h-[38px]
              `}
              >
                <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-semibold text-white">
                  {ghe.soGhe}
                </span>
              </button>
            );
          })}
        </div>
      );
    });
  };

  return (
    <section className="flex-1 flex flex-col items-center w-full">
      {/* SCREEN */}
      <div className="w-full max-w-5xl px-4 mb-8">
        <p className="text-center text-[9px] sm:text-[10px] tracking-[5px] uppercase text-gray-400 mb-4">
          SCREEN
        </p>

        <div className="relative">
          <div
            className="
          h-5
          sm:h-6
          lg:h-8

          rounded-t-[55px]
          sm:rounded-t-[70px]
          lg:rounded-t-[90px]

          bg-gradient-to-b
          from-orange-500
          to-orange-700

          shadow-[0_0_25px_rgba(249,115,22,.75)]
        "
          />

          <div
            className="
          absolute
          inset-x-0

          top-5
          sm:top-6
          lg:top-8

          h-8
          sm:h-10
          lg:h-14

          bg-gradient-to-b
          from-orange-500/25
          to-transparent
        "
          />
        </div>
      </div>

      {/* LEGEND */}
      <div className="w-full flex justify-center mb-8 px-4">
        <div
          className="
        flex
        flex-wrap
        justify-center
        items-center

        gap-3
        sm:gap-5

        px-4
        sm:px-6

        py-2.5

        rounded-xl

        bg-[#171717]/80

        border
        border-orange-500/20

        backdrop-blur-md
        shadow-lg
      "
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border border-gray-400 bg-black/50" />
            <span className="text-[11px] sm:text-xs text-gray-300">
              Ghế trống
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-gray-400" />
            <span className="text-[11px] sm:text-xs text-gray-300">
              Ghế đã đặt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-orange-500" />
            <span className="text-[11px] sm:text-xs text-gray-300">
              Ghế đang chọn
            </span>
          </div>
        </div>
      </div>

      {/* SEAT MAP */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="w-fit mx-auto px-2 sm:px-4">
          {/* HEADER */}
          <div
            className="
          grid

          grid-cols-[22px_repeat(12,24px)]
          sm:grid-cols-[28px_repeat(12,30px)]
          md:grid-cols-[32px_repeat(12,34px)]
          lg:grid-cols-[36px_repeat(12,38px)]

          gap-1
          sm:gap-2

          mb-3
        "
          >
            <div />
            {renderHeaderGhe()}
          </div>

          {/* SEATS */}
          {renderGhe()}
        </div>
      </div>
    </section>
  );
};

export default RapPhim;

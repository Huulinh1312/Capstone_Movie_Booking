import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import RapPhim from "../components/RapPhim";
import DanhsachGheDaChon from "../components/DanhsachGheDaChon";
import { setThongTinPhim } from "../store/booking/bookingSlice";

const BookingPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.thongTinPhim) {
      dispatch(setThongTinPhim(location.state.thongTinPhim));
    }
  }, [dispatch, location.state]);
  // render
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat lg:bg-fixed"
      style={{
        backgroundImage: "url('/bg-booking.png')",
      }}
    >
      <div className="min-h-screen bg-black/70">
        <main
          className="
            max-w-[1600px]
            mx-auto
            flex
            flex-col
            xl:flex-row
            items-start

            gap-6
            xl:gap-8

            px-4
            sm:px-6
            xl:px-8

            pt-20
            sm:pt-24
            xl:pt-28

            pb-10
          "
        >
          {/* LEFT */}
          <div className="flex-1 w-full min-w-0">
            <RapPhim />
          </div>

          {/* RIGHT */}
          <aside
            className="
              w-full
              xl:w-[360px]
              2xl:w-[390px]
              shrink-0
            "
          >
            <DanhsachGheDaChon />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default BookingPage;

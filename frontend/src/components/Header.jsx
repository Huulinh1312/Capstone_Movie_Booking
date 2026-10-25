import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectorIsLoggedIn, selectorUser } from "../store/authSlice";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const user = useSelector(selectorUser);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    queryClient.removeQueries({ queryKey: ["profile"] });
    dispatch(logout());
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/70 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-red-500 tracking-wide hover:scale-105 transition"
        >
          TLMovie
        </Link>

        {/* HAMBURGER (mobile) */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center w-full">
          {/* MENU CENTER */}
          <div className="flex-1 flex justify-center gap-10">
            <Link
              onClick={() => scrollToSection("lich-chieu")}
              to="/cinema"
              className="relative text-white hover:text-red-400 group"
            >
              Rạp chiếu
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all"></span>
            </Link>

            <Link
              onClick={() => scrollToSection("dat-ve")}
              to="/ticket"
              className="relative text-white hover:text-red-400 group"
            >
              Đặt vé
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all"></span>
            </Link>

            <a
              onClick={() => scrollToSection("tin-tuc")}
              className="relative text-white hover:text-red-400 group"
              href="https://vnexpress.net/giai-tri/phim"
            >
              Tin tức
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all"></span>
            </a>
          </div>

          {/* AUTH */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link className="text-sm text-gray-300" to="/profile">
                  Xin chào,{" "}
                  <span className="text-yellow-400 font-semibold">
                    {user?.hoTen}
                  </span>
                </Link>

                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm text-white"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link className="text-white hover:text-yellow-400">
                  Trang chủ
                </Link>

                <Link
                  to="/register"
                  className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm"
                >
                  Đăng ký
                </Link>

                <Link
                  to="/login"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm text-white"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/90 border-t border-white/10 px-6 py-4 space-y-4">
          <button
            onClick={() => scrollToSection("lich-chieu")}
            className="block text-white"
          >
            Lịch chiếu
          </button>

          <button
            onClick={() => scrollToSection("phim")}
            className="block text-white"
          >
            Phim
          </button>

          <button
            onClick={() => scrollToSection("tin-tuc")}
            className="block text-white"
          >
            Tin tức
          </button>

          <div className="border-t border-white/10 pt-3">
            {isLoggedIn ? (
              <>
                <div className="text-yellow-400 mb-2">{user?.hoTen}</div>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-lg text-white w-full"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="block border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg text-center mb-2"
                >
                  Đăng ký
                </Link>

                <Link
                  to="/login"
                  className="block bg-yellow-400 text-black px-4 py-2 rounded-lg text-center"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

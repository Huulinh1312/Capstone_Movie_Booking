import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#070A12] text-white border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              TL<span className="text-red-500">Movie</span>
            </h2>
            <p className="text-gray-400 text-sm leading-6">
              Đặt vé xem phim nhanh chóng, cập nhật phim mới và lịch chiếu hấp
              dẫn mỗi ngày.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Khám phá</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <Link to="/" className="hover:text-red-400 transition">
                Trang chủ
              </Link>
              <Link to="/movie" className="hover:text-red-400 transition">
                Danh sách phim
              </Link>
              <Link to="/cinema" className="hover:text-red-400 transition">
                Rạp chiếu
              </Link>
              <Link to="/news" className="hover:text-red-400 transition">
                Tin điện ảnh
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Hỗ trợ</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="#" className="hover:text-red-400 transition">
                Trung tâm trợ giúp
              </a>
              <a href="#" className="hover:text-red-400 transition">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-red-400 transition">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-red-400 transition">
                Liên hệ
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Kết nối</h3>

            <div className="flex gap-3 mb-5">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-red-600 transition"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-red-600 transition"
              >
                YT
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-red-600 transition"
              >
                IG
              </a>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              Nhận thông báo phim mới
            </p>

            <div className="flex bg-white/10 border border-white/10 rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Email của bạn"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button className="bg-red-600 hover:bg-red-700 px-4 text-sm font-semibold transition">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 TLMovie. All rights reserved.</p>
          <p>Designed for cinema lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

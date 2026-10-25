import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative bg-gradient-to-b from-gray-800 to-gray-950 rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/30 hover:border-red-500/50 hover:shadow-yellow-400/20 hover:-translate-y-2 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={movie.hinhAnh}
          alt={movie.tenPhim}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

        {/* Badges: chỉ render badge nào = true */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {movie.hot && (
            <span className="bg-red-500/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/30">
              HOT
            </span>
          )}
          {movie.dangChieu && (
            <span className="bg-emerald-500/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
              Đang chiếu
            </span>
          )}
          {movie.sapChieu && (
            <span className="bg-sky-500/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-sky-500/30">
              Sắp chiếu
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="text-white text-sm font-semibold">
            {movie.danhGia}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-1 truncate group-hover:text-red-300 transition-colors">
          {movie.tenPhim}
        </h3>

        <p className="text-gray-400 text-sm mb-4">{movie.ngayKhoiChieu}</p>

        <Link
          to={`/movie/${movie.maPhim}`}
          className="block text-center bg-red-500 hover:bg-red-400 text-gray-950 font-bold py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;

import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { maPhim } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovieDetail(maPhim);

  const rating = Math.round(movie?.danhGia || 0);
  const trailerId = movie?.trailer?.split("v=")[1]?.split("&")[0];

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Không tìm thấy phim</p>
          <Link to="/movie" className="text-red-400 hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white overflow-hidden">
      <div className="relative min-h-[760px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm scale-110"
          style={{
            backgroundImage: `url(${movie?.hinhAnh})`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#070A12] via-[#070A12]/90 to-[#070A12]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-transparent to-black/50" />

        <div className="relative max-w-7xl mx-auto px-4 py-6">
          <Link
            to="/movie"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-10 bg-black/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            ← Quay lại danh sách
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-[32px]" />

              <img
                src={movie?.hinhAnh}
                alt={movie?.tenPhim}
                className="relative w-full max-w-[340px] mx-auto lg:mx-0 aspect-[2/3] object-cover rounded-[28px] border border-white/15 shadow-2xl shadow-black/70"
              />

              <div className="relative max-w-[340px] mx-auto lg:mx-0 mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-md">
                  <p className="text-gray-400 text-xs mb-1">Đánh giá</p>
                  <p className="text-2xl font-extrabold text-yellow-400">
                    {movie?.danhGia}/10
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-md">
                  <p className="text-gray-400 text-xs mb-1">Mã phim</p>
                  <p className="text-2xl font-extrabold text-white">
                    #{movie?.maPhim}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-black/35 border border-white/10 backdrop-blur-xl p-5 md:p-8 shadow-2xl shadow-black/50">
              <div className="flex flex-wrap gap-2 mb-5">
                {movie?.hot && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-600/30">
                    🔥 HOT
                  </span>
                )}

                {movie?.dangChieu && (
                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Đang chiếu
                  </span>
                )}

                {movie?.sapChieu && (
                  <span className="bg-sky-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Sắp chiếu
                  </span>
                )}
              </div>

              <p className="text-red-500 text-sm font-bold uppercase tracking-[0.3em] mb-3">
                Movie Premiere
              </p>

              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
                {movie?.tenPhim}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-7">
                <div className="flex gap-1 rounded-full bg-white/10 border border-white/10 px-4 py-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-base ${
                        index < rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-gray-300 font-semibold">
                  {movie?.ngayKhoiChieu}
                </span>
              </div>

              {movie?.moTa && (
                <div className="mb-8">
                  <h3 className="text-white font-bold text-xl mb-3">
                    Nội dung phim
                  </h3>
                  <p className="text-gray-300 leading-8 text-base md:text-lg">
                    {movie.moTa}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                  <p className="text-gray-500 text-xs mb-1">Nhóm</p>
                  <p className="text-white font-bold">{movie?.maNhom}</p>
                </div>

                <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                  <p className="text-gray-500 text-xs mb-1">Bí danh</p>
                  <p className="text-white font-bold truncate">
                    {movie?.biDanh}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                  <p className="text-gray-500 text-xs mb-1">Trạng thái</p>
                  <p className="text-white font-bold">
                    {movie?.dangChieu ? "Đang chiếu" : "Sắp chiếu"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {movie?.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                  >
                    ▶ Xem Trailer
                  </a>
                )}

                <button
                  onClick={() => navigate(`/ticket/${movie?.maPhim}`)}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                >
                  🎟 Đặt vé ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {trailerId && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-6">
            <p className="text-red-500 text-sm font-bold uppercase tracking-[0.3em] mb-2">
              Official Video
            </p>
            <h2 className="text-3xl md:text-4xl font-black">Trailer</h2>
          </div>

          <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/70 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}`}
              title={movie?.tenPhim}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

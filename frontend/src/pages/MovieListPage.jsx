import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMovieList } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";

const MovieListPage = () => {
  const { data: movies, isLoading, isError, error } = useMovieList("GP01");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("default");

  //  Hàm dùng để scroll slider bảng xếp hạng
  const [topCurrent, setTopCurrent] = useState(0);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);

  const topMovies = movies?.slice(0, 10) || [];
  const topPages = Array.from(
    { length: Math.ceil(topMovies.length / 5) },
    (_, index) => topMovies.slice(index * 5, index * 5 + 5),
  );

  const handleDragStart = (clientX) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragEndX.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging.current) return;
    dragEndX.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging.current || topPages.length <= 1) return;

    const distance = dragStartX.current - dragEndX.current;
    const minSwipeDistance = 60;

    if (distance > minSwipeDistance) {
      setTopCurrent((prev) => (prev + 1) % topPages.length);
    }

    if (distance < -minSwipeDistance) {
      setTopCurrent((prev) => (prev === 0 ? topPages.length - 1 : prev - 1));
    }

    isDragging.current = false;
  };

  // Slider phim nổi bật trong tuần
  const [spotlightCurrent, setSpotlightCurrent] = useState(0);
  const spotlightStartX = useRef(0);
  const spotlightEndX = useRef(0);
  const spotlightDragging = useRef(false);
  const spotlightMoved = useRef(false);

  const spotlightMovies = movies?.slice(10, 20) || [];
  const spotlightMovie =
    spotlightMovies.length > 0 ? spotlightMovies[spotlightCurrent] : null;

  const handleSpotlightStart = (clientX) => {
    spotlightDragging.current = true;
    spotlightMoved.current = false;
    spotlightStartX.current = clientX;
    spotlightEndX.current = clientX;
  };

  const handleSpotlightMove = (clientX) => {
    if (!spotlightDragging.current) return;

    spotlightEndX.current = clientX;

    if (Math.abs(spotlightStartX.current - clientX) > 8) {
      spotlightMoved.current = true;
    }
  };

  const handleSpotlightEnd = () => {
    if (!spotlightDragging.current || spotlightMovies.length <= 1) return;

    const distance = spotlightStartX.current - spotlightEndX.current;
    const minSwipeDistance = 60;

    if (distance > minSwipeDistance) {
      setSpotlightCurrent((prev) => (prev + 1) % spotlightMovies.length);
    }

    if (distance < -minSwipeDistance) {
      setSpotlightCurrent((prev) =>
        prev === 0 ? spotlightMovies.length - 1 : prev - 1,
      );
    }

    spotlightDragging.current = false;
  };

  // Hàm phân trang
  const MOVIES_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm filter thanh search và select
  const filteredMovies = useMemo(() => {
    let result = movies || [];

    const keyword = searchTerm.trim().toLowerCase();

    if (keyword) {
      result = result.filter((movie) => {
        return (
          movie.tenPhim?.toLowerCase().includes(keyword) ||
          movie.biDanh?.toLowerCase().includes(keyword) ||
          String(movie.maPhim).includes(keyword)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((movie) => {
        if (statusFilter === "hot") return movie.hot;
        if (statusFilter === "dangChieu") return movie.dangChieu;
        if (statusFilter === "sapChieu") return movie.sapChieu;
        return true;
      });
    }

    if (sortFilter === "ratingDesc") {
      result = [...result].sort((a, b) => b.danhGia - a.danhGia);
    }

    if (sortFilter === "ratingAsc") {
      result = [...result].sort((a, b) => a.danhGia - b.danhGia);
    }

    if (sortFilter === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.ngayKhoiChieu) - new Date(a.ngayKhoiChieu),
      );
    }

    if (sortFilter === "oldest") {
      result = [...result].sort(
        (a, b) => new Date(a.ngayKhoiChieu) - new Date(b.ngayKhoiChieu),
      );
    }

    return result;
  }, [movies, searchTerm, statusFilter, sortFilter]);

  const totalMovies = filteredMovies.length;
  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [movies, searchTerm, statusFilter, sortFilter]);

  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      {/* Hero Banner */}
      <Banner />

      <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-[#08090f] py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_35%)]" />

        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Danh sách{" "}
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
              Phim
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            Khám phá hàng trăm bộ phim hấp dẫn
          </p>

          {/* Top Movies */}
          <div
            className="relative overflow-hidden rounded-3xl bg-[#10131d] border border-white/10 p-4 md:p-6 shadow-2xl shadow-black/40 select-none cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {" "}
            <div className="max-w-7xl mx-auto mb-12 text-left">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-red-500 text-sm font-bold uppercase tracking-[0.25em] mb-2">
                    Bảng xếp hạng
                  </p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    Top 10 Phim Hay Nhất
                  </h2>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-[#10131d] border border-white/10 p-4 md:p-6 shadow-2xl shadow-black/40">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${topCurrent * 100}%)`,
                  }}
                >
                  {topPages.map((page, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
                    >
                      {page.map((movie, index) => {
                        const rank = pageIndex * 5 + index + 1;

                        return (
                          <Link
                            to={`/movie/${movie.maPhim}`}
                            key={movie.maPhim}
                            className="group relative h-[320px] overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-xl shadow-black/40 hover:border-red-500/60 transition-all duration-300"
                          >
                            <img
                              src={movie.hinhAnh}
                              alt={movie.tenPhim}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            <div className="absolute top-3 left-3 text-[72px] font-black leading-none text-white/20 group-hover:text-red-500/40 transition-colors">
                              {rank}
                            </div>

                            <div className="absolute top-3 right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-600/40">
                              TOP {rank}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-bold text-base mb-3 truncate">
                                {movie.tenPhim}
                              </h3>

                              <div className="flex items-center justify-between">
                                <span className="bg-white/15 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-md border border-white/10">
                                  P.Đề
                                </span>

                                <span className="text-red-400 text-sm font-semibold">
                                  ★ {movie.danhGia}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* ARROWS */}
                {topPages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setTopCurrent(
                          topCurrent === 0
                            ? topPages.length - 1
                            : topCurrent - 1,
                        )
                      }
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-red-600 transition"
                    >
                      ❮
                    </button>

                    <button
                      onClick={() =>
                        setTopCurrent((topCurrent + 1) % topPages.length)
                      }
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-red-600 transition"
                    >
                      ❯
                    </button>
                  </>
                )}

                {/* DOTS */}
                <div className="flex justify-center gap-2 mt-6">
                  {topPages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTopCurrent(index)}
                      className={`transition-all duration-300 rounded-full ${
                        topCurrent === index
                          ? "w-8 h-2 bg-red-500"
                          : "w-2 h-2 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-[1fr_220px_220px] gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm tên phim, bí danh, mã phim..."
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/10 rounded-full px-6 py-3.5 pr-12 outline-none backdrop-blur-md shadow-lg shadow-black/20 focus:border-red-500/70 focus:ring-2 focus:ring-red-400/30 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl">
                🔍
              </span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 text-white border border-white/10 rounded-full px-5 py-3.5 outline-none backdrop-blur-md shadow-lg shadow-black/20 focus:border-red-500/70 focus:ring-2 focus:ring-red-400/30 transition-all"
            >
              <option className="bg-[#11141d]" value="all">
                Tất cả phim
              </option>
              <option className="bg-[#11141d]" value="hot">
                Phim hot
              </option>
              <option className="bg-[#11141d]" value="dangChieu">
                Đang chiếu
              </option>
              <option className="bg-[#11141d]" value="sapChieu">
                Sắp chiếu
              </option>
            </select>

            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="bg-white/10 text-white border border-white/10 rounded-full px-5 py-3.5 outline-none backdrop-blur-md shadow-lg shadow-black/20 focus:border-red-500/70 focus:ring-2 focus:ring-red-400/30 transition-all"
            >
              <option className="bg-[#11141d]" value="default">
                Sắp xếp mặc định
              </option>
              <option className="bg-[#11141d]" value="ratingDesc">
                Đánh giá cao nhất
              </option>
              <option className="bg-[#11141d]" value="ratingAsc">
                Đánh giá thấp nhất
              </option>
              <option className="bg-[#11141d]" value="newest">
                Ngày chiếu mới nhất
              </option>
              <option className="bg-[#11141d]" value="oldest">
                Ngày chiếu cũ nhất
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-xl font-semibold mb-2">
              Đã xảy ra lỗi!
            </p>
            <p className="text-gray-400">{error?.message}</p>
          </div>
        )}

        {/* Count */}
        <p className="text-gray-400 mb-6">
          Tìm thấy{" "}
          <span className="text-yellow-400 font-semibold">
            {filteredMovies.length}
          </span>{" "}
          phim
        </p>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
          {paginatedMovies.map((movie) => (
            <MovieCard key={movie.maPhim} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full border transition ${
                    currentPage === page
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white/10 border-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Spotlight Movies */}
      {spotlightMovie && (
        <div className="max-w-7xl mx-auto px-4 mb-16 text-left mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-red-500 text-sm font-bold uppercase tracking-[0.25em] mb-2">
                Gợi ý hôm nay
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Phim nổi bật trong tuần
              </h2>
            </div>

            <button
              onClick={() =>
                setSpotlightCurrent(
                  (prev) => (prev + 1) % spotlightMovies.length,
                )
              }
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white hover:bg-red-600 transition"
            >
              ❯
            </button>
          </div>

          <div
            className="relative h-[520px] md:h-[560px] overflow-hidden rounded-[28px] bg-[#11141d] border border-white/10 shadow-2xl shadow-black/50 select-none cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleSpotlightStart(e.clientX)}
            onMouseMove={(e) => handleSpotlightMove(e.clientX)}
            onMouseUp={handleSpotlightEnd}
            onMouseLeave={handleSpotlightEnd}
            onTouchStart={(e) => handleSpotlightStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleSpotlightMove(e.touches[0].clientX)}
            onTouchEnd={handleSpotlightEnd}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35 blur-2xl scale-125 transition-all duration-700"
                style={{
                  backgroundImage: `url(${spotlightMovie.hinhAnh})`,
                }}
              />

              <img
                src={spotlightMovie.hinhAnh}
                alt={spotlightMovie.tenPhim}
                className="absolute right-0 top-0 h-full w-full md:w-[62%] object-cover object-center opacity-80 transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#11141d] via-[#11141d]/85 to-[#11141d]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-transparent to-black/20" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#11141d] via-[#11141d]/90 to-[#11141d]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-transparent to-black/20" />

            <div className="relative z-10 h-full p-6 md:p-12 pb-44 flex flex-col overflow-hidden">
              <div className="max-w-xl">
                <p className="text-red-500 text-sm font-bold uppercase tracking-[0.25em] mb-3">
                  Spotlight
                </p>

                <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight line-clamp-2 max-w-3xl">
                  {spotlightMovie.tenPhim}
                </h3>

                <p className="text-red-300 text-sm md:text-base mb-5 truncate max-w-md">
                  {spotlightMovie.biDanh}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-md backdrop-blur-md">
                    {spotlightMovie.ngayKhoiChieu}
                  </span>

                  <span className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-md backdrop-blur-md">
                    Mã phim #{spotlightMovie.maPhim}
                  </span>

                  <span className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-md backdrop-blur-md">
                    ★ {spotlightMovie.danhGia}/10
                  </span>
                </div>

                <p className="text-gray-200 leading-7 line-clamp-2 md:line-clamp-3 max-w-2xl">
                  {spotlightMovie.moTa ||
                    "Khám phá bộ phim nổi bật với trải nghiệm điện ảnh hấp dẫn."}
                </p>

                <div className="flex items-center gap-3 mt-7">
                  <Link
                    to={`/movie/${spotlightMovie.maPhim}`}
                    onClick={(e) => {
                      if (spotlightMoved.current) e.preventDefault();
                    }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white text-xl md:text-2xl shadow-xl shadow-red-600/40 transition"
                  >
                    ▶
                  </Link>

                  <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition">
                    ♥
                  </button>

                  <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition">
                    i
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 -mt-16 px-4 md:px-10">
            <div className="flex justify-start md:justify-center gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-4 px-1">
              {spotlightMovies.map((movie, index) => (
                <button
                  key={movie.maPhim}
                  onClick={() => setSpotlightCurrent(index)}
                  className={`relative h-28 w-20 md:h-36 md:w-24 shrink-0 overflow-hidden rounded-xl border bg-[#11141d] shadow-xl shadow-black/50 transition-all duration-300 ${
                    spotlightCurrent === index
                      ? "border-red-500 -translate-y-3 ring-2 ring-red-500/40 shadow-red-500/30"
                      : "border-white/10 opacity-80 hover:opacity-100 hover:-translate-y-2"
                  }`}
                >
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="h-full w-full object-cover"
                  />

                  {spotlightCurrent === index && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListPage;

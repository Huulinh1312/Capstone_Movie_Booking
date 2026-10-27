import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cinemaApi } from "../api/cinemaApi";
import { getAssetUrl } from "../api/axiosInstance";
import { movieApi } from "../api/movieApi";

const fallbackHero =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2200&q=85";

function unwrap(value) {
  const data = value?.data ?? value;
  return Array.isArray(data) ? data : data ? [data] : [];
}

function MovieCard({ movie }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-xl shadow-black/20">
      <Link to={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
          {movie.image ? (
            <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={getAssetUrl(movie.image)} alt={movie.name} />
          ) : <div className="flex h-full items-center justify-center text-slate-500">NO POSTER</div>}
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold uppercase">Đang chiếu</span>
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-amber-300">★ {movie.rating ?? 0}</span>
        </div>
        <div className="p-4">
          <h3 className="truncate font-bold text-white">{movie.name}</h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{movie.description || "Khám phá bộ phim và chọn suất chiếu phù hợp."}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Link to={`/movies/${movie.id}`} className="block rounded-lg bg-red-500 py-2 text-center text-sm font-bold transition hover:bg-red-400">Đặt vé</Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [systems, setSystems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([movieApi.getMovieList(), movieApi.getBanners(), cinemaApi.getHeThongRap()])
      .then(([movieResult, bannerResult, cinemaResult]) => {
        if (movieResult.status === "fulfilled") setMovies(unwrap(movieResult.value));
        if (bannerResult.status === "fulfilled") setBanners(unwrap(bannerResult.value));
        if (cinemaResult.status === "fulfilled") setSystems(unwrap(cinemaResult.value));
        if (movieResult.status === "rejected") setError("Không tải được danh sách phim.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMovies = useMemo(() => movies.filter((movie) => movie.name?.toLowerCase().includes(query.toLowerCase())), [movies, query]);
  const comingSoon = movies.filter((movie) => !movie.isShowing).slice(0, 3);
  const heroImage = banners[0]?.image || banners[0]?.hinhAnh || movies[0]?.image;

  return (
    <div className="bg-[#070b14] text-[#f8fafc]">
      <section className="relative isolate min-h-[570px] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg,#070b14 5%,#070b14cc 40%,#070b1455),linear-gradient(0deg,#070b14,transparent 55%),url('${getAssetUrl(heroImage) || fallbackHero}')` }} />
        <div className="mx-auto flex min-h-[570px] max-w-7xl items-end px-4 pb-28 pt-32 sm:px-8">
          <div className="max-w-2xl">
            <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">● Phim bom tấn đang hot</span>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">Trải nghiệm điện ảnh đỉnh cao <span className="text-red-400">& đặt vé tức thì</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Khám phá những bộ phim mới nhất, chọn rạp và ghế ngồi yêu thích chỉ trong vài bước.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#now-showing" className="rounded-xl bg-red-500 px-6 py-3 text-sm font-bold shadow-lg shadow-red-500/25 transition hover:bg-red-400">🍿 Đặt vé ngay</a>
              <Link to="/cinemas" className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">Hệ thống rạp</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#111827]/95 p-4 shadow-2xl backdrop-blur md:grid-cols-[1.4fr_1fr_auto]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔎 Tìm phim theo tên..." />
          <select value={selectedMovie} onChange={(event) => setSelectedMovie(event.target.value)}>
            <option value="">Chọn phim để đặt vé</option>
            {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.name}</option>)}
          </select>
          <button onClick={() => selectedMovie && navigate(`/movies/${selectedMovie}`)} className="rounded-lg bg-red-500 px-6 py-3 text-sm font-bold hover:bg-red-400">Tìm suất chiếu</button>
        </div>
      </section>

      <section id="now-showing" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-red-400">Lịch chiếu toàn quốc</p><h2 className="mt-2 text-3xl font-black">Phim đang chiếu</h2></div>
          <Link to="/movies" className="text-sm font-semibold text-red-300 hover:text-white">Xem tất cả →</Link>
        </div>
        {loading && <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="aspect-[2/3] animate-pulse rounded-2xl bg-slate-800" />)}</div>}
        {!loading && error && <p className="rounded-xl bg-red-500/10 p-5 text-red-300">{error}</p>}
        {!loading && !error && <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{filteredMovies.slice(0, 10).map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>}
      </section>

      <section className="border-y border-white/5 bg-[#0d121d]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Hệ thống liên kết</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-black">Cụm rạp đối tác toàn quốc</h2><Link to="/cinemas" className="text-sm text-red-300">Xem hệ thống rạp →</Link></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{systems.map((system) => <div key={system.id || system.code} className="rounded-xl border border-white/10 bg-[#111827] p-5"><p className="text-lg font-bold">{system.name}</p><p className="mt-1 text-sm text-slate-400">{system.cinemas?.length || 0} cụm rạp</p></div>)}</div>
        </div>
      </section>

      {comingSoon.length > 0 && <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Khởi chiếu sắp tới</p><h2 className="mt-2 text-3xl font-black">Phim sắp ra mắt</h2></div><Link to="/movies" className="text-sm text-red-300">Xem tất cả →</Link></div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{comingSoon.map((movie) => <article key={movie.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]"><div className="relative aspect-video bg-slate-800">{movie.image && <img className="h-full w-full object-cover" src={getAssetUrl(movie.image)} alt={movie.name} />}<span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[10px] text-amber-300">Khởi chiếu sắp tới</span></div><div className="p-5"><p className="text-xs uppercase text-slate-500">Movie Booking</p><h3 className="mt-2 text-lg font-bold">{movie.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{movie.description || "Thông tin phim sẽ được cập nhật sớm."}</p><Link to={`/movies/${movie.id}`} className="mt-5 block rounded-lg bg-white/5 py-2 text-center text-sm font-semibold hover:bg-red-500">Xem trailer / chi tiết</Link></div></article>)}</div>
      </section>}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8"><div className="rounded-2xl border border-red-400/20 bg-gradient-to-br from-red-500/20 to-[#111827] p-8"><p className="text-sm font-bold uppercase tracking-wider text-amber-300">Trải nghiệm điện ảnh</p><h2 className="mt-3 max-w-xl text-3xl font-black">Đặt vé nhanh, chọn ghế yêu thích, tận hưởng bộ phim.</h2><p className="mt-3 max-w-xl text-slate-300">Movie Booking giúp bạn tìm phim và đặt vé trực tuyến thuận tiện trên mọi thiết bị.</p></div></section>
    </div>
  );
}

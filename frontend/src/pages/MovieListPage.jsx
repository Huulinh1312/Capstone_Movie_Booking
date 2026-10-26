import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { movieApi } from "../api/movieApi";
import { getAssetUrl } from "../api/axiosInstance";

export default function MovieListPage() {
  const [movies, setMovies] = useState([]); const [query, setQuery] = useState(""); const [error, setError] = useState("");
  useEffect(() => { movieApi.getMovieList().then(({ data }) => setMovies(Array.isArray(data) ? data : [])).catch((e) => setError(e.response?.data?.message || "Không tải được danh sách phim")); }, []);
  const filtered = useMemo(() => movies.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())), [movies, query]);
  return <main><section className="bg-cover bg-center px-4 py-24 text-center" style={{ backgroundImage: "linear-gradient(#0008,#0008),url('/bg-login.png')" }}><h1 className="text-5xl font-black">Phim đang chiếu</h1><p className="mt-3 text-slate-300">Đặt vé nhanh, chọn ghế trực tuyến</p></section><section className="mx-auto max-w-7xl px-4 py-10"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Danh sách phim</h2><input className="max-w-xs" placeholder="Tìm tên phim..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>{error && <p className="text-red-300">{error}</p>}<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((movie) => <Link className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1" key={movie.id} to={`/movies/${movie.id}`}><div className="aspect-[2/3] bg-slate-800">{movie.image && <img className="h-full w-full object-cover" src={getAssetUrl(movie.image)} alt={movie.name} />}</div><div className="p-4"><h3 className="font-bold">{movie.name}</h3><p className="mt-2 text-sm text-amber-300">★ {movie.rating}/10</p><p className="mt-1 text-xs text-slate-400">{movie.isShowing ? "Đang chiếu" : "Sắp chiếu"}</p></div></Link>)}</div></section></main>;
}

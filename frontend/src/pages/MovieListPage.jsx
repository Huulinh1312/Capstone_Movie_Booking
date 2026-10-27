import { useEffect, useMemo, useState } from "react";
import { movieApi } from "../api/movieApi";
import { unwrapList } from "../api/response";
import MovieCard from "../components/MovieCard";
import { EmptyState, LoadingState } from "../components/PageState";

export default function MovieListPage() {
  const [movies, setMovies] = useState([]); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all"); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { movieApi.getMovieList().then((response) => setMovies(unwrapList(response))).catch((e) => setError(e.response?.data?.message || "Không thể tải danh sách phim.")).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => movies.filter((movie) => { const matchesQuery = movie.name?.toLowerCase().includes(query.toLowerCase()); const matchesFilter = filter === "all" || (filter === "showing" ? movie.isShowing : movie.isUpcoming || !movie.isShowing); return matchesQuery && matchesFilter; }), [movies, query, filter]);
  return <main className="min-h-screen bg-[#070b14] text-white">
    <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(239,68,68,.22),transparent_35%)]" /><div className="relative mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[.25em] text-red-400">Cinematic library</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Kho phim <span className="text-red-400">đặc sắc</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">Tìm kiếm bộ phim yêu thích, khám phá thông tin và chọn suất chiếu phù hợp tại hệ thống rạp của chúng tôi.</p></div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8"><div className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-[#111827] p-4 md:grid-cols-[1fr_auto]"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔎 Tìm theo tên phim..." /><div className="flex flex-wrap gap-2"><button onClick={() => setFilter("all")} className={`rounded-lg px-4 py-2 text-xs font-bold ${filter === "all" ? "bg-red-500" : "bg-white/10 text-slate-300"}`}>Tất cả</button><button onClick={() => setFilter("showing")} className={`rounded-lg px-4 py-2 text-xs font-bold ${filter === "showing" ? "bg-red-500" : "bg-white/10 text-slate-300"}`}>Đang chiếu</button><button onClick={() => setFilter("upcoming")} className={`rounded-lg px-4 py-2 text-xs font-bold ${filter === "upcoming" ? "bg-red-500" : "bg-white/10 text-slate-300"}`}>Sắp chiếu</button></div></div>
      {loading && <LoadingState label="Đang tải danh sách phim..." />}{!loading && error && <div className="rounded-xl bg-red-500/10 p-5 text-sm text-red-200">{error}</div>}{!loading && !error && !filtered.length && <EmptyState title="Không tìm thấy phim" description="Thử từ khóa khác hoặc chọn lại bộ lọc." />}{!loading && !error && filtered.length > 0 && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{filtered.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>}
    </section>
  </main>;
}

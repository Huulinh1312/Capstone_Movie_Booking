import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { movieApi } from "../api/movieApi";
import { cinemaApi } from "../api/cinemaApi";
import { getAssetUrl } from "../api/axiosInstance";

export default function MovieDetailPage() {
  const { id } = useParams(); const [movie, setMovie] = useState(null); const [shows, setShows] = useState([]); const [error, setError] = useState("");
  useEffect(() => { Promise.all([movieApi.getMovieDetail(id), cinemaApi.getLichChieuPhim(id)]).then(([m, s]) => { setMovie(m.data); setShows(Array.isArray(s.data) ? s.data : [s.data].filter(Boolean)); }).catch((e) => setError(e.response?.data?.message || "Không tải được chi tiết phim")); }, [id]);
  if (error) return <p className="p-10 text-red-300">{error}</p>;
  if (!movie) return <p className="p-10">Đang tải...</p>;
  return <main className="mx-auto max-w-6xl px-4 py-12"><section className="grid gap-8 md:grid-cols-[260px_1fr]"><div className="aspect-[2/3] bg-slate-800">{movie.image && <img className="h-full w-full object-cover" src={getAssetUrl(movie.image)} alt={movie.name} />}</div><div><h1 className="text-4xl font-black">{movie.name}</h1><p className="mt-4 text-slate-300">{movie.description}</p><p className="mt-4 text-amber-300">★ {movie.rating}/10</p><h2 className="mt-8 text-2xl font-bold">Lịch chiếu</h2><div className="mt-4 flex flex-wrap gap-3">{shows.map((show) => <Link className="rounded-xl bg-red-600 px-4 py-3" key={show.id} to={`/booking/${show.id}`}>{new Date(show.startAt).toLocaleString("vi-VN")} · {show.ticketPrice.toLocaleString("vi-VN")}đ</Link>)}</div>{!shows.length && <p className="mt-3 text-slate-400">Chưa có lịch chiếu.</p>}</div></section></main>;
}

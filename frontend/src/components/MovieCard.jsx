import { Link } from "react-router-dom";
import { getAssetUrl } from "../api/axiosInstance";

export default function MovieCard({ movie }) {
  const status = movie.isShowing ? "Đang chiếu" : movie.isUpcoming ? "Sắp chiếu" : "Đã cập nhật";
  return <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/40">
    <Link to={`/movies/${movie.id}`} className="block">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#1b2433]">
        {movie.image ? <img src={getAssetUrl(movie.image)} alt={movie.name} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "flex"; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : null}<div className={`h-full flex-col items-center justify-center gap-2 text-slate-500 ${movie.image ? "hidden" : "flex"}`}><span className="text-4xl">🎬</span><span className="text-[10px] uppercase tracking-widest">No poster</span></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-black uppercase">{status}</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-amber-300">★ {movie.rating ?? 0}/10</span>
      </div>
      <div className="p-4"><h3 className="truncate font-bold text-white">{movie.name}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{movie.description || "Khám phá thông tin và suất chiếu của bộ phim."}</p></div>
    </Link>
    <div className="px-4 pb-4"><Link to={`/movies/${movie.id}`} className="block rounded-xl bg-red-500 py-2.5 text-center text-xs font-black uppercase tracking-wider hover:bg-red-400">Xem suất chiếu</Link></div>
  </article>;
}

import { useEffect, useState } from "react";
import { movieApi } from "../../api/movieApi";
import { showtimesApi } from "../../api/showtimesApi";
import { userApi } from "../../api/userApi";
import { cinemaApi } from "../../api/cinemaApi";

const emptyMovie = { tenPhim: "", maNhom: "GP01", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: 5 };

export default function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [systems, setSystems] = useState([]);
  const [movie, setMovie] = useState(emptyMovie);
  const [showtime, setShowtime] = useState({ maPhim: "", maRap: "", ngayChieuGioChieu: "", giaVe: 90000 });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [movieResponse, userResponse, cinemaResponse] = await Promise.all([
      movieApi.getMovieList(), userApi.getList(), cinemaApi.getHeThongRap(),
    ]);
    setMovies(Array.isArray(movieResponse.data) ? movieResponse.data : []);
    setUsers(Array.isArray(userResponse.data) ? userResponse.data : userResponse.data?.items || []);
    setSystems(Array.isArray(cinemaResponse.data) ? cinemaResponse.data : [cinemaResponse.data].filter(Boolean));
  };
  useEffect(() => { load().catch((error) => setMessage(error.response?.data?.message || "Không tải được dữ liệu quản trị")); }, []);

  const addMovie = async (event) => {
    event.preventDefault();
    const form = new FormData();
    Object.entries(movie).forEach(([key, value]) => form.append(key, value));
    if (file) form.append("file", file);
    await movieApi.addMovieWithImage(form);
    setMessage("Đã thêm phim");
    setMovie(emptyMovie); setFile(null); await load();
  };

  const deleteMovie = async (id) => {
    if (!window.confirm("Xóa phim này?")) return;
    await movieApi.deleteMovie(id); setMessage("Đã xóa phim"); await load();
  };

  const addShowtime = async (event) => {
    event.preventDefault();
    await showtimesApi.createShowtime({ ...showtime, maPhim: Number(showtime.maPhim), giaVe: Number(showtime.giaVe) });
    setMessage("Đã tạo lịch chiếu");
  };

  return <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
    <div className="mx-auto max-w-7xl space-y-8">
      <h1 className="text-3xl font-bold text-red-400">Quản trị Movie Booking</h1>
      {message && <p className="rounded-lg bg-emerald-500/15 p-3 text-emerald-300">{message}</p>}
      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addMovie} className="space-y-3 rounded-2xl bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Thêm phim + upload hình</h2>
          <input required placeholder="Tên phim" value={movie.tenPhim} onChange={(e) => setMovie({ ...movie, tenPhim: e.target.value })} />
          <input placeholder="Trailer URL" value={movie.trailer} onChange={(e) => setMovie({ ...movie, trailer: e.target.value })} />
          <textarea placeholder="Mô tả" value={movie.moTa} onChange={(e) => setMovie({ ...movie, moTa: e.target.value })} />
          <input type="date" value={movie.ngayKhoiChieu} onChange={(e) => setMovie({ ...movie, ngayKhoiChieu: e.target.value })} />
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="rounded-lg bg-red-600 px-4 py-2">Thêm phim</button>
        </form>
        <form onSubmit={addShowtime} className="space-y-3 rounded-2xl bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Tạo lịch chiếu</h2>
          <select required value={showtime.maPhim} onChange={(e) => setShowtime({ ...showtime, maPhim: e.target.value })}><option value="">Chọn phim</option>{movies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <input required placeholder="Mã phòng, ví dụ CGV-SG-01" value={showtime.maRap} onChange={(e) => setShowtime({ ...showtime, maRap: e.target.value })} />
          <input required type="datetime-local" value={showtime.ngayChieuGioChieu} onChange={(e) => setShowtime({ ...showtime, ngayChieuGioChieu: new Date(e.target.value).toISOString() })} />
          <input required type="number" value={showtime.giaVe} onChange={(e) => setShowtime({ ...showtime, giaVe: e.target.value })} />
          <button className="rounded-lg bg-amber-500 px-4 py-2 text-black">Tạo lịch chiếu</button>
        </form>
      </section>
      <section className="rounded-2xl bg-slate-900 p-5"><h2 className="mb-4 text-xl font-semibold">Phim ({movies.length})</h2><div className="grid gap-3 md:grid-cols-2">{movies.map((item) => <div className="flex items-center justify-between rounded-lg bg-slate-800 p-3" key={item.id}><span>{item.name}</span><button className="text-red-300" onClick={() => deleteMovie(item.id)}>Xóa</button></div>)}</div></section>
      <section className="rounded-2xl bg-slate-900 p-5"><h2 className="mb-4 text-xl font-semibold">Người dùng ({users.length})</h2><div className="grid gap-2 md:grid-cols-2">{users.map((item) => <div className="rounded-lg bg-slate-800 p-3" key={item.id || item.account}>{item.fullName || item.hoTen} · {item.account || item.taiKhoan}</div>)}</div></section>
      <section className="rounded-2xl bg-slate-900 p-5"><h2 className="mb-4 text-xl font-semibold">Rạp và phòng</h2>{systems.map((system) => <div key={system.id} className="mb-3"><b>{system.name}</b>{system.cinemas?.map((cinema) => <p className="text-slate-300" key={cinema.id}>{cinema.name}: {cinema.rooms?.map((room) => room.code).join(", ")}</p>)}</div>)}</section>
    </div>
  </main>;
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cinemaApi } from "../../api/cinemaApi";
import { getAssetUrl } from "../../api/axiosInstance";
import { movieApi } from "../../api/movieApi";
import { showtimesApi } from "../../api/showtimesApi";
import { userApi } from "../../api/userApi";
import Modal, { ConfirmDialog } from "../../components/Modal";

const emptyMovie = { tenPhim: "", maNhom: "GP01", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: 5 };
const emptyUser = { taiKhoan: "", matKhau: "123456", email: "", soDt: "", hoTen: "", maLoaiNguoiDung: "KhachHang" };
const emptyShowtime = { maPhim: "", maRap: "CGV-SG-01", ngayChieuGioChieu: "", giaVe: 90000 };
const unwrap = (response) => { const data = response?.data ?? response; return Array.isArray(data) ? data : data ? [data] : []; };

function ActionButton({ children, onClick, tone = "neutral", type = "button" }) {
  return <button type={type} onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-bold ${tone === "danger" ? "bg-red-500/15 text-red-300 hover:bg-red-500 hover:text-white" : tone === "primary" ? "bg-red-500 text-white hover:bg-red-400" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}>{children}</button>;
}

export default function AdminPage() {
  const [tab, setTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [systems, setSystems] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [userForm, setUserForm] = useState(emptyUser);
  const [showtimeForm, setShowtimeForm] = useState(emptyShowtime);
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const errorMessage = (error, fallback) => {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(" · ") : message || fallback;
  };

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([movieApi.getMovieList(), userApi.getList(), cinemaApi.getHeThongRap()]);
      if (results[0].status === "fulfilled") setMovies(unwrap(results[0].value));
      if (results[1].status === "fulfilled") setUsers(unwrap(results[1].value));
      if (results[2].status === "fulfilled") setSystems(unwrap(results[2].value));
    } catch { setNotice({ type: "error", text: "Không tải được dữ liệu quản trị." }); } finally { setLoading(false); }
  };
  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);
  useEffect(() => { if (!notice.text) return undefined; const timer = setTimeout(() => setNotice({ type: "", text: "" }), 3500); return () => clearTimeout(timer); }, [notice]);

  const filteredMovies = useMemo(() => movies.filter((movie) => movie.name?.toLowerCase().includes(query.toLowerCase())), [movies, query]);
  const openAddMovie = () => { setMovieForm(emptyMovie); setFile(null); setModal("addMovie"); };
  const openEditMovie = (movie) => { setMovieForm({ maPhim: movie.id, tenPhim: movie.name || "", maNhom: movie.groupCode || "GP01", trailer: movie.trailer || "", moTa: movie.description || "", ngayKhoiChieu: movie.releaseDate?.slice(0, 10) || "", danhGia: movie.rating || 5 }); setFile(null); setModal("editMovie"); };
  const submitMovie = async (event) => {
    event.preventDefault();
    const rating = Number(movieForm.danhGia);
    if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
      setNotice({ type: "error", text: "Đánh giá phải là số nguyên từ 0 đến 10." });
      return;
    }
    try {
      const form = new FormData();
      Object.entries({ ...movieForm, danhGia: rating }).forEach(([key, value]) => { if (value !== undefined && value !== "") form.append(key, String(value)); });
      if (file) form.append("file", file);
      if (modal === "editMovie") await movieApi.updateMovieWithImage(form); else await movieApi.addMovieWithImage(form);
      setModal(null); setNotice({ type: "success", text: modal === "editMovie" ? "Đã cập nhật phim." : "Đã thêm phim mới." }); await load();
    } catch (error) { setNotice({ type: "error", text: errorMessage(error, "Không thể lưu phim.") }); }
  };
  const removeMovie = async (movie) => {
    setConfirm({ kind: "movie", movie });
  };
  const submitUser = async (event) => {
    event.preventDefault();
    const payload = { ...userForm };
    if (!payload.matKhau) delete payload.matKhau;
    try { if (modal === "addUser") await userApi.add(payload); else await userApi.update(payload); setModal(null); setNotice({ type: "success", text: modal === "addUser" ? "Đã thêm người dùng." : "Đã cập nhật người dùng." }); await load(); } catch (error) { setNotice({ type: "error", text: errorMessage(error, "Không thể lưu người dùng.") }); }
  };
  const removeUser = async (user) => {
    if (user.role === "ADMIN") { setNotice({ type: "error", text: "Không thể xóa tài khoản quản trị." }); return; }
    setConfirm({ kind: "user", user });
  };
  const confirmDelete = async () => {
    setConfirmBusy(true);
    try {
      if (confirm.kind === "movie") await movieApi.deleteMovie(confirm.movie.id);
      else await userApi.remove(confirm.user.account || confirm.user.taiKhoan);
      setConfirm(null);
      setNotice({ type: "success", text: confirm.kind === "movie" ? "Đã xóa phim thành công." : "Đã xóa người dùng thành công." });
      await load();
    } catch (error) {
      setConfirm(null);
      setNotice({ type: "error", text: errorMessage(error, "Thao tác không thể thực hiện.") });
    } finally { setConfirmBusy(false); }
  };
  const submitShowtime = async (event) => {
    event.preventDefault();
    try { await showtimesApi.createShowtime({ ...showtimeForm, maPhim: Number(showtimeForm.maPhim), giaVe: Number(showtimeForm.giaVe), ngayChieuGioChieu: new Date(showtimeForm.ngayChieuGioChieu).toISOString() }); setModal(null); setNotice({ type: "success", text: "Đã tạo lịch chiếu." }); } catch (error) { setNotice({ type: "error", text: error.response?.data?.message || "Không thể tạo lịch chiếu." }); }
  };

  const formInput = (label, key, type = "text", form = movieForm, setForm = setMovieForm) => <label className="block text-xs font-semibold text-slate-300">{label}<input required={["tenPhim", "taiKhoan", "email", "hoTen"].includes(key)} type={type} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2" /></label>;

  return <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><Link to="/" className="text-xs text-slate-400 hover:text-white">← Về trang khách</Link><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-red-300">Quản trị / Admin Portal</p><h1 className="mt-2 text-3xl font-black">Tổng quan Movie Booking</h1><p className="mt-2 text-sm text-slate-400">Quản lý nội dung phim, người dùng và lịch chiếu.</p></div><div className="flex gap-2"><ActionButton onClick={() => setModal("showtime")} tone="neutral">＋ Tạo lịch chiếu</ActionButton><ActionButton onClick={openAddMovie} tone="primary">＋ Thêm phim mới</ActionButton></div></div>
      {notice.text && <div className={`mb-5 rounded-xl border p-4 text-sm ${notice.type === "error" ? "border-red-400/20 bg-red-500/10 text-red-200" : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"}`}>{notice.text}</div>}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-white/10 bg-[#111827] p-5"><p className="text-xs text-slate-400">Tổng số phim</p><p className="mt-2 text-3xl font-black">{movies.length}</p></div><div className="rounded-2xl border border-white/10 bg-[#111827] p-5"><p className="text-xs text-slate-400">Tổng người dùng</p><p className="mt-2 text-3xl font-black">{users.length}</p></div><div className="rounded-2xl border border-white/10 bg-[#111827] p-5"><p className="text-xs text-slate-400">Hệ thống rạp</p><p className="mt-2 text-3xl font-black text-amber-300">{systems.length}</p></div><div className="rounded-2xl border border-white/10 bg-[#111827] p-5"><p className="text-xs text-slate-400">Trạng thái API</p><p className="mt-2 text-xl font-black text-emerald-300">● Online</p></div></div>
      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111827] p-2"><button onClick={() => setTab("movies")} className={`rounded-xl px-5 py-3 text-sm font-bold ${tab === "movies" ? "bg-red-500" : "text-slate-400 hover:bg-white/10"}`}>🎬 Quản lý phim</button><button onClick={() => setTab("users")} className={`rounded-xl px-5 py-3 text-sm font-bold ${tab === "users" ? "bg-red-500" : "text-slate-400 hover:bg-white/10"}`}>👥 Người dùng</button><button onClick={() => setTab("cinemas")} className={`rounded-xl px-5 py-3 text-sm font-bold ${tab === "cinemas" ? "bg-red-500" : "text-slate-400 hover:bg-white/10"}`}>🏢 Rạp & phòng</button></div>
      {loading ? <div className="rounded-2xl bg-[#111827] p-10 text-center text-slate-400">Đang tải dữ liệu quản trị...</div> : <>
        {tab === "movies" && <section className="rounded-2xl border border-white/10 bg-[#111827] p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">Danh sách phim</h2><p className="mt-1 text-sm text-slate-400">Poster được lưu bền vững và không bị ghi đè khi thêm phim khác.</p></div><input className="max-w-xs" placeholder="Tìm tên phim..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredMovies.map((movie) => <article key={movie.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0f19]"><div className="aspect-[2/3] bg-slate-800">{movie.image ? <img className="h-full w-full object-cover" src={getAssetUrl(movie.image)} alt={movie.name} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "flex"; }} /> : null}<div className={`h-full items-center justify-center text-xs text-slate-500 ${movie.image ? "hidden" : "flex"}`}>Chưa có poster</div></div><div className="p-4"><h3 className="truncate font-bold">{movie.name}</h3><p className="mt-1 text-xs text-amber-300">★ {movie.rating}/10 · {movie.isShowing ? "Đang chiếu" : "Sắp chiếu"}</p><div className="mt-4 flex gap-2"><ActionButton onClick={() => openEditMovie(movie)}>Sửa</ActionButton><ActionButton tone="danger" onClick={() => removeMovie(movie)}>Xóa</ActionButton></div></div></article>)}</div></section>}
        {tab === "users" && <section className="rounded-2xl border border-white/10 bg-[#111827] p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">Danh sách người dùng</h2><p className="mt-1 text-sm text-slate-400">Thêm, sửa và xóa tài khoản bằng popup.</p></div><ActionButton onClick={() => { setUserForm(emptyUser); setModal("addUser"); }} tone="primary">＋ Thêm người dùng</ActionButton></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-slate-500"><tr><th className="p-3">Tài khoản</th><th className="p-3">Họ tên</th><th className="p-3">Email</th><th className="p-3">Quyền</th><th className="p-3">Thao tác</th></tr></thead><tbody>{users.map((user) => <tr key={user.id || user.account} className="border-b border-white/5"><td className="p-3 font-semibold">{user.account || user.taiKhoan}</td><td className="p-3">{user.fullName || user.hoTen}</td><td className="p-3 text-slate-400">{user.email}</td><td className="p-3 text-amber-300">{user.role === "ADMIN" ? "QuanTri" : "KhachHang"}</td><td className="flex gap-2 p-3"><ActionButton onClick={() => { setUserForm({ taiKhoan: user.account, matKhau: "", email: user.email, soDt: user.phone || "", hoTen: user.fullName, maLoaiNguoiDung: user.role === "ADMIN" ? "QuanTri" : "KhachHang" }); setModal("editUser"); }}>Sửa</ActionButton><ActionButton tone="danger" onClick={() => removeUser(user)}>Xóa</ActionButton></td></tr>)}</tbody></table></div></section>}
        {tab === "cinemas" && <section className="rounded-2xl border border-white/10 bg-[#111827] p-5"><h2 className="text-xl font-black">Danh sách hệ thống rạp</h2><p className="mt-1 text-sm text-slate-400">Danh sách được lấy từ backend và dùng để tạo lịch chiếu.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{systems.map((system) => <article key={system.id || system.code} className="rounded-xl border border-white/10 bg-[#0b0f19] p-5"><h3 className="text-lg font-bold">{system.name}</h3>{system.cinemas?.map((cinema) => <div key={cinema.id} className="mt-4 border-t border-white/10 pt-3"><p className="font-semibold">{cinema.name}</p><p className="text-sm text-slate-400">{cinema.address}</p><div className="mt-2 flex flex-wrap gap-2">{cinema.rooms?.map((room) => <span key={room.id} className="rounded bg-white/10 px-2 py-1 text-xs text-slate-300">{room.code}</span>)}</div></div>)}</article>)}</div></section>}
      </>}
    </div>
    {confirm && <ConfirmDialog title={confirm.kind === "movie" ? "Xóa phim này?" : "Xóa tài khoản này?"} message={confirm.kind === "movie" ? `Bạn sắp xóa "${confirm.movie.name}". Hành động này không thể hoàn tác.` : `Bạn sắp xóa tài khoản "${confirm.user.account || confirm.user.taiKhoan}". Dữ liệu đặt vé liên quan cũng sẽ được xử lý.`} confirmLabel="Xóa ngay" onConfirm={confirmDelete} onClose={() => setConfirm(null)} busy={confirmBusy} />}
    {modal === "addMovie" || modal === "editMovie" ? <Modal wide title={modal === "editMovie" ? "Chỉnh sửa phim" : "Thêm phim mới"} onClose={() => setModal(null)}><form onSubmit={submitMovie} className="grid gap-4 sm:grid-cols-2">{formInput("Tên phim", "tenPhim")} {formInput("Trailer URL", "trailer")} {formInput("Ngày khởi chiếu", "ngayKhoiChieu", "date")} {formInput("Đánh giá", "danhGia", "number")}<label className="block text-xs font-semibold text-slate-300 sm:col-span-2">Mô tả<textarea value={movieForm.moTa} onChange={(event) => setMovieForm({ ...movieForm, moTa: event.target.value })} className="mt-2 min-h-28" /></label><label className="block text-xs font-semibold text-slate-300 sm:col-span-2">Poster phim<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2" /></label><div className="flex justify-end gap-2 sm:col-span-2"><ActionButton onClick={() => setModal(null)}>Hủy</ActionButton><ActionButton type="submit" tone="primary">{modal === "editMovie" ? "Lưu thay đổi" : "Thêm phim"}</ActionButton></div></form></Modal> : null}
    {modal === "addUser" || modal === "editUser" ? <Modal title={modal === "editUser" ? "Chỉnh sửa người dùng" : "Thêm người dùng"} onClose={() => setModal(null)}><form onSubmit={submitUser} className="space-y-4">{formInput("Tài khoản", "taiKhoan", "text", userForm, setUserForm)} {modal === "addUser" && formInput("Mật khẩu", "matKhau", "password", userForm, setUserForm)} {formInput("Họ tên", "hoTen", "text", userForm, setUserForm)} {formInput("Email", "email", "email", userForm, setUserForm)} {formInput("Số điện thoại", "soDt", "text", userForm, setUserForm)}<label className="block text-xs font-semibold text-slate-300">Quyền<select value={userForm.maLoaiNguoiDung} onChange={(event) => setUserForm({ ...userForm, maLoaiNguoiDung: event.target.value })} className="mt-2"><option value="KhachHang">Khách hàng</option><option value="QuanTri">Quản trị</option></select></label><div className="flex justify-end gap-2"><ActionButton onClick={() => setModal(null)}>Hủy</ActionButton><ActionButton type="submit" tone="primary">Lưu</ActionButton></div></form></Modal> : null}
    {modal === "showtime" ? <Modal title="Tạo lịch chiếu mới" onClose={() => setModal(null)}><form onSubmit={submitShowtime} className="space-y-4"><label className="block text-xs font-semibold text-slate-300">Phim<select required value={showtimeForm.maPhim} onChange={(event) => setShowtimeForm({ ...showtimeForm, maPhim: event.target.value })} className="mt-2"><option value="">Chọn phim</option>{movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.name}</option>)}</select></label>{formInput("Mã phòng", "maRap", "text", showtimeForm, setShowtimeForm)}{formInput("Thời gian chiếu", "ngayChieuGioChieu", "datetime-local", showtimeForm, setShowtimeForm)}{formInput("Giá vé", "giaVe", "number", showtimeForm, setShowtimeForm)}<div className="flex justify-end gap-2"><ActionButton onClick={() => setModal(null)}>Hủy</ActionButton><ActionButton type="submit" tone="primary">Tạo lịch chiếu</ActionButton></div></form></Modal> : null}
  </main>;
}

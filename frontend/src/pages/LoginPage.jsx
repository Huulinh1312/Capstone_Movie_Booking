import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "../api/authApi";
import { login } from "../store/authSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ taiKhoan: "", matKhau: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.taiKhoan.trim() || form.matKhau.length < 6) {
      setError("Vui lòng nhập tài khoản và mật khẩu từ 6 ký tự.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await authApi.login({ taiKhoan: form.taiKhoan.trim(), matKhau: form.matKhau });
      dispatch(login(data));
      navigate("/");
    } catch (requestError) {
      const message = requestError.response?.data?.message;
      setError(Array.isArray(message) ? message.join(", ") : message || "Tài khoản hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account, password) => setForm({ taiKhoan: account, matKhau: password });

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 py-10 text-white">
    <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/bg-login.png')" }} />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,.14),transparent_58%)]" />
    <section className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#171c25]/95 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8">
      <div className="mb-7 text-center"><Link to="/" className="text-sm font-bold tracking-[.15em] text-red-300">▣ CINEVERSE</Link><h1 className="mt-5 text-2xl font-black">Đăng nhập tài khoản</h1><p className="mt-2 text-xs leading-5 text-slate-400">Chào mừng bạn trở lại! Đăng nhập để tận hưởng đặt vé tiện lợi.</p></div>
      {error && <p className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs font-semibold text-slate-300">Tài khoản hoặc Email<input autoComplete="username" value={form.taiKhoan} onChange={(event) => setForm({ ...form, taiKhoan: event.target.value })} placeholder="Nhập tài khoản hoặc email..." className="mt-2" /></label>
        <label className="block text-xs font-semibold text-slate-300">Mật khẩu<div className="relative mt-2"><input autoComplete="current-password" type={showPassword ? "text" : "password"} minLength={6} value={form.matKhau} onChange={(event) => setForm({ ...form, matKhau: event.target.value })} placeholder="••••••••" className="pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{showPassword ? "Ẩn" : "Hiện"}</button></div></label>
        <div className="flex items-center justify-between text-xs text-slate-400"><label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-red-500" /> Ghi nhớ đăng nhập</label><button type="button" className="text-red-300">Quên mật khẩu?</button></div>
        <button disabled={loading} className="w-full rounded-lg bg-red-500 py-3 text-sm font-bold shadow-lg shadow-red-500/25 transition hover:bg-red-400 disabled:opacity-50">{loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP →"}</button>
      </form>
      <div className="mt-5 rounded-lg bg-[#0b0f19] p-3"><div className="mb-2 flex justify-between text-[10px] font-bold uppercase text-amber-300"><span>Tài khoản demo nhanh:</span><span className="text-slate-500">Chạm để tự điền</span></div><div className="grid grid-cols-2 gap-2"><button onClick={() => fillDemo("admin", "123456")} className="rounded bg-[#1b2029] p-2 text-left text-xs hover:bg-slate-700">◉ Quản trị viên<br /><span className="text-slate-400">admin / 123456</span></button><button onClick={() => fillDemo("user01", "123456")} className="rounded bg-[#1b2029] p-2 text-left text-xs hover:bg-slate-700">▣ Khách hàng<br /><span className="text-slate-400">user01 / 123456</span></button></div></div>
      <p className="mt-6 text-center text-xs text-slate-400">Chưa có tài khoản? <Link className="font-semibold text-red-300 hover:text-white" to="/register">Đăng ký ngay</Link></p>
      <p className="mt-8 text-center text-[10px] tracking-[.2em] text-amber-200">DOLBY ATMOS - IMAX LASER - VIP 4DX</p>
    </section>
  </main>;
}

export function AuthCard({ title, children }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#070b14] px-4 py-10 text-white"><section className="w-full max-w-md rounded-xl border border-white/10 bg-[#171c25] p-8 shadow-2xl"><h1 className="mb-6 text-center text-2xl font-black">{title}</h1>{children}</section></main>;
}

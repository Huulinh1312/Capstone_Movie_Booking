import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function RegisterPage() {
  const [form, setForm] = useState({ taiKhoan: "", matKhau: "", email: "", soDt: "", hoTen: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.matKhau.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    try { setLoading(true); await authApi.register(form); navigate("/login"); } catch (requestError) { const message = requestError.response?.data?.message; setError(Array.isArray(message) ? message.join(", ") : message || "Đăng ký thất bại."); } finally { setLoading(false); }
  };
  const fields = [["taiKhoan", "Tài khoản"], ["matKhau", "Mật khẩu"], ["email", "Email"], ["soDt", "Số điện thoại"], ["hoTen", "Họ tên"]];
  return <main className="flex min-h-screen items-center justify-center bg-[#070b14] px-4 py-10 text-white"><section className="w-full max-w-md rounded-xl border border-white/10 bg-[#171c25] p-7 shadow-2xl sm:p-8"><div className="mb-7 text-center"><Link to="/" className="text-sm font-bold tracking-[.15em] text-red-300">▣ CINEVERSE</Link><h1 className="mt-5 text-2xl font-black">Tạo tài khoản</h1><p className="mt-2 text-xs text-slate-400">Đăng ký để bắt đầu hành trình điện ảnh của bạn.</p></div>{error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}<form onSubmit={submit} className="space-y-3">{fields.map(([key, label]) => <label key={key} className="block text-xs font-semibold text-slate-300">{label}<input required type={key === "matKhau" ? "password" : key === "email" ? "email" : "text"} minLength={key === "matKhau" ? 6 : undefined} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2" /></label>)}<button disabled={loading} className="mt-2 w-full rounded-lg bg-red-500 py-3 text-sm font-bold hover:bg-red-400 disabled:opacity-50">{loading ? "ĐANG TẠO..." : "TẠO TÀI KHOẢN →"}</button></form><p className="mt-6 text-center text-xs text-slate-400">Đã có tài khoản? <Link className="text-red-300" to="/login">Đăng nhập</Link></p></section></main>;
}

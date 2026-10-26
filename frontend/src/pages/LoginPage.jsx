import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "../api/authApi";
import { login } from "../store/authSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ taiKhoan: "", matKhau: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); const dispatch = useDispatch();
  const submit = async (e) => {
    e.preventDefault(); setError("");
    try { const { data } = await authApi.login(form); dispatch(login(data)); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Đăng nhập thất bại"); }
  };
  return <AuthCard title="Đăng nhập"><form onSubmit={submit} className="space-y-4">{error && <p className="text-red-300">{error}</p>}<input required placeholder="Tài khoản" value={form.taiKhoan} onChange={(e) => setForm({ ...form, taiKhoan: e.target.value })} /><input required type="password" placeholder="Mật khẩu" value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} /><button className="w-full rounded-lg bg-red-600 py-3">Đăng nhập</button><p className="text-center text-slate-400">Chưa có tài khoản? <Link className="text-red-400" to="/register">Đăng ký</Link></p></form></AuthCard>;
}

export function AuthCard({ title, children }) {
  return <main className="flex min-h-screen items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "linear-gradient(#0009,#0009),url('/bg-login.png')" }}><section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl"><h1 className="mb-6 text-center text-3xl font-bold text-red-400">{title}</h1>{children}</section></main>;
}

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
    const account = form.taiKhoan.trim();
    if (!account || !form.matKhau) {
      setError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    if (form.matKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      const { data } = await authApi.login({ taiKhoan: account, matKhau: form.matKhau });
      dispatch(login(data));
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message.join(", ") : message || "Tài khoản hoặc mật khẩu không đúng");
    }
  };
  return <AuthCard title="Đăng nhập"><form onSubmit={submit} className="space-y-4">{error && <p className="text-red-300">{error}</p>}<input required placeholder="Tài khoản" value={form.taiKhoan} onChange={(e) => setForm({ ...form, taiKhoan: e.target.value })} /><input required minLength={6} type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} /><button className="w-full rounded-lg bg-red-600 py-3">Đăng nhập</button><p className="text-center text-slate-400">Chưa có tài khoản? <Link className="text-red-400" to="/register">Đăng ký</Link></p></form></AuthCard>;
}

export function AuthCard({ title, children }) {
  return <main className="flex min-h-screen items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "linear-gradient(#0009,#0009),url('/bg-login.png')" }}><section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl"><h1 className="mb-6 text-center text-3xl font-bold text-red-400">{title}</h1>{children}</section></main>;
}

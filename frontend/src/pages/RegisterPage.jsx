import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { AuthCard } from "./LoginPage";

export default function RegisterPage() {
  const [form, setForm] = useState({ taiKhoan: "", matKhau: "", email: "", soDt: "", hoTen: "" });
  const [error, setError] = useState(""); const navigate = useNavigate();
  const submit = async (e) => { e.preventDefault(); try { await authApi.register(form); navigate("/login"); } catch (err) { setError(err.response?.data?.message || "Đăng ký thất bại"); } };
  return <AuthCard title="Tạo tài khoản"><form onSubmit={submit} className="space-y-3">{error && <p className="text-red-300">{error}</p>}{[["taiKhoan","Tài khoản"],["matKhau","Mật khẩu"],["email","Email"],["soDt","Số điện thoại"],["hoTen","Họ tên"]].map(([key,label]) => <input required key={key} type={key === "matKhau" ? "password" : key === "email" ? "email" : "text"} placeholder={label} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}<button className="w-full rounded-lg bg-red-600 py-3">Đăng ký</button><p className="text-center text-slate-400">Đã có tài khoản? <Link className="text-red-400" to="/login">Đăng nhập</Link></p></form></AuthCard>;
}

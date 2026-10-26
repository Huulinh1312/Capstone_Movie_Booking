import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null); const [error, setError] = useState("");
  useEffect(() => { userApi.getProfile().then(({ data }) => setProfile(data)).catch((e) => setError(e.response?.data?.message || "Không tải được tài khoản")); }, []);
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-12"><h1 className="text-3xl font-bold">Tài khoản</h1>{error && <p className="mt-4 text-red-300">{error}</p>}{profile && <div className="mt-6 space-y-3 rounded-2xl bg-slate-900 p-6"><p><b>Họ tên:</b> {profile.fullName || profile.hoTen}</p><p><b>Tài khoản:</b> {profile.account || profile.taiKhoan}</p><p><b>Email:</b> {profile.email}</p><p><b>Số điện thoại:</b> {profile.phone || profile.soDt || "Chưa cập nhật"}</p><p><b>Quyền:</b> {profile.role || profile.maLoaiNguoiDung}</p></div>}</main>;
}

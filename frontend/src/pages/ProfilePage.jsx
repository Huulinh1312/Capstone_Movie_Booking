import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../api/userApi";
import { bookingApi } from "../api/showtimesApi";
import { unwrapList, unwrapObject } from "../api/response";
import { LoadingState } from "../components/PageState";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null); const [history, setHistory] = useState([]); const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([userApi.getProfile(), bookingApi.getHistory()])
      .then(([profileResponse, historyResponse]) => {
        setProfile(unwrapObject(profileResponse));
        setHistory(unwrapList(historyResponse));
      })
      .catch((e) => setError(e.response?.data?.message || "Không tải được thông tin tài khoản."));
  }, []);
  if (!profile && !error) return <main className="mx-auto max-w-5xl px-4 py-12"><LoadingState label="Đang tải hồ sơ..." /></main>;
  const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN") : "Không rõ thời gian";
  return <main className="min-h-screen bg-[#070b14] px-4 py-12 text-white sm:px-8"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[.25em] text-red-400">Member area</p><h1 className="mt-3 text-4xl font-black">Hồ sơ <span className="text-red-400">cá nhân</span></h1></div>{error ? <div className="rounded-xl bg-red-500/10 p-5 text-red-200">{error}</div> : <div className="grid gap-6 md:grid-cols-[280px_1fr]"><aside className="rounded-2xl border border-white/10 bg-[#111827] p-6 text-center"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-3xl font-black">{(profile.fullName || profile.hoTen || "U").slice(0, 1).toUpperCase()}</div><h2 className="mt-4 text-xl font-black">{profile.fullName || profile.hoTen}</h2><p className="mt-1 text-sm text-slate-400">@{profile.account || profile.taiKhoan}</p><span className="mt-4 inline-block rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">{profile.role === "ADMIN" || profile.maLoaiNguoiDung === "QuanTri" ? "Quản trị viên" : "Thành viên"}</span><Link to="/movies" className="mt-6 block rounded-xl bg-red-500 py-3 text-sm font-bold hover:bg-red-400">Khám phá phim</Link></aside><section className="rounded-2xl border border-white/10 bg-[#111827] p-6"><h2 className="text-xl font-black">Thông tin tài khoản</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Họ và tên", profile.fullName || profile.hoTen], ["Tài khoản", profile.account || profile.taiKhoan], ["Email", profile.email], ["Số điện thoại", profile.phone || profile.soDt || "Chưa cập nhật"]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#0b0f19] p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-semibold">{value || "Chưa cập nhật"}</p></div>)}</div><div className="mt-8 border-t border-white/10 pt-6"><h2 className="text-xl font-black">Lịch sử đặt vé</h2>{history.length ? <div className="mt-4 space-y-3">{history.map((booking) => <article key={booking.id} className="rounded-xl border border-white/10 bg-[#0b0f19] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{booking.showtime?.movie?.name || "Suất chiếu"}</h3><p className="mt-1 text-sm text-slate-400">{booking.showtime?.room?.cinema?.name || "Rạp chưa cập nhật"} · {formatDate(booking.showtime?.startAt)}</p></div><span className="font-bold text-amber-300">{Number(booking.totalPrice || 0).toLocaleString("vi-VN")}đ</span></div><p className="mt-3 text-xs text-slate-500">Ghế: {booking.seats?.map(({ seat }) => seat?.name || seat?.code).filter(Boolean).join(", ") || "Không rõ"} · Đặt lúc {formatDate(booking.createdAt)}</p></article>)}</div> : <p className="mt-4 rounded-xl bg-[#0b0f19] p-4 text-sm text-slate-400">Bạn chưa có vé nào. Hãy chọn một bộ phim để bắt đầu.</p>}</div></section></div>}</div></main>;
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userApi } from "../api/userApi";
import { bookingApi } from "../api/showtimesApi";
import { unwrapList, unwrapObject } from "../api/response";
import { login } from "../store/authSlice";
import { LoadingState } from "../components/PageState";
import { ConfirmDialog, default as Modal } from "../components/Modal";
import ToastMessage from "../components/ToastMessage";

const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN") : "Không rõ thời gian";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });

  const showToast = (type, message) => setToast({ visible: true, type, message });

  useEffect(() => {
    const timer = toast.visible ? window.setTimeout(() => setToast((current) => ({ ...current, visible: false })), 3000) : null;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [toast.visible]);

  const loadHistory = () => bookingApi.getHistory()
    .then((response) => { setHistory(unwrapList(response)); setHistoryError(""); })
    .catch((e) => setHistoryError(e.response?.status === 404 ? "Backend production chưa triển khai API lịch sử đặt vé." : e.response?.data?.message || "Không tải được lịch sử đặt vé."));

  useEffect(() => {
    userApi.getProfile()
      .then((response) => {
        const data = unwrapObject(response);
        setProfile(data);
        setForm({ hoTen: data.fullName || "", email: data.email || "", soDt: data.phone || "", avatar: data.avatar || "" });
      })
      .catch((e) => setError(e.response?.data?.message || "Không tải được thông tin tài khoản."));
    loadHistory();
  }, []);

  const selectAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("error", "Vui lòng chọn một tệp hình ảnh."); return; }
    if (file.size > 2 * 1024 * 1024) { showToast("error", "Ảnh đại diện không được vượt quá 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await userApi.updateProfile(form);
      const updated = unwrapObject({ data });
      setProfile(updated);
      setForm({ hoTen: updated.fullName || "", email: updated.email || "", soDt: updated.phone || "", avatar: updated.avatar || "" });
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      dispatch(login({ ...stored, hoTen: updated.fullName, email: updated.email, avatar: updated.avatar }));
      setEditing(false);
      showToast("success", "Đã cập nhật hồ sơ.");
    } catch (e) {
      showToast("error", e.response?.data?.message || "Không thể cập nhật hồ sơ.");
    } finally { setSaving(false); }
  };

  const removeHistory = async () => {
    try {
      setDeletingId(confirmId);
      await bookingApi.deleteHistory(confirmId);
      setHistory((items) => items.filter((item) => item.id !== confirmId));
      setConfirmId(null);
      showToast("success", "Đã xóa vé khỏi lịch sử.");
    } catch (e) {
      showToast("error", e.response?.data?.message || "Không thể xóa vé.");
    } finally { setDeletingId(null); }
  };

  if (!profile && !error) return <main className="mx-auto max-w-5xl px-4 py-12"><LoadingState label="Đang tải hồ sơ..." /></main>;
  if (error) return <main className="mx-auto max-w-5xl px-4 py-12"><div className="rounded-xl bg-red-500/10 p-5 text-red-200">{error}</div></main>;
  const avatar = profile.avatar;
  return <main className="min-h-screen bg-[#070b14] px-4 py-12 text-white sm:px-8">
    <ToastMessage visible={toast.visible} type={toast.type} message={toast.message} />
    <div className="mx-auto max-w-5xl">
      <div className="mb-8"><p className="text-xs font-black uppercase tracking-[.25em] text-red-400">Member area</p><h1 className="mt-3 text-4xl font-black">Hồ sơ <span className="text-red-400">cá nhân</span></h1></div>
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-[#111827] p-6 text-center">
          {avatar ? <img src={avatar} alt="Ảnh đại diện" className="mx-auto h-24 w-24 rounded-full object-cover" /> : <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-3xl font-black">{(profile.fullName || "U").slice(0, 1).toUpperCase()}</div>}
          <h2 className="mt-4 text-xl font-black">{profile.fullName}</h2><p className="mt-1 text-sm text-slate-400">@{profile.account}</p><span className="mt-4 inline-block rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300">{profile.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}</span>
          <button onClick={() => { setForm({ hoTen: profile.fullName || "", email: profile.email || "", soDt: profile.phone || "", avatar: profile.avatar || "" }); setEditing(true); }} className="mt-6 w-full rounded-xl border border-red-400/30 py-3 text-sm font-bold text-red-200 hover:bg-red-500/15">Chỉnh sửa hồ sơ</button>
          <Link to="/movies" className="mt-3 block rounded-xl bg-red-500 py-3 text-sm font-bold hover:bg-red-400">Khám phá phim</Link>
        </aside>
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-xl font-black">Thông tin tài khoản</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Họ và tên", profile.fullName], ["Tài khoản", profile.account], ["Email", profile.email], ["Số điện thoại", profile.phone || "Chưa cập nhật"]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#0b0f19] p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-semibold">{value || "Chưa cập nhật"}</p></div>)}</div>
          <div className="mt-8 border-t border-white/10 pt-6"><h2 className="text-xl font-black">Lịch sử đặt vé</h2>{historyError ? <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-200">{historyError}</p> : history.length ? <div className="mt-4 space-y-3">{history.map((booking) => <article key={booking.id} className="rounded-xl border border-white/10 bg-[#0b0f19] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{booking.showtime?.movie?.name || "Suất chiếu"}</h3><p className="mt-1 text-sm text-slate-400">{booking.showtime?.room?.cinema?.name || "Rạp chưa cập nhật"} · {formatDate(booking.showtime?.startAt)}</p></div><div className="text-right"><span className="font-bold text-amber-300">{Number(booking.totalPrice || 0).toLocaleString("vi-VN")}đ</span><button onClick={() => setConfirmId(booking.id)} className="mt-2 block text-xs text-red-300 hover:text-red-200">Xóa lịch sử</button></div></div><p className="mt-3 text-xs text-slate-500">Ghế: {booking.seats?.map(({ seat }) => seat?.name || seat?.code).filter(Boolean).join(", ") || "Không rõ"} · Đặt lúc {formatDate(booking.createdAt)}</p></article>)}</div> : <p className="mt-4 rounded-xl bg-[#0b0f19] p-4 text-sm text-slate-400">Bạn chưa có vé nào.</p>}</div>
        </section>
      </div>
    </div>
    {editing && <Modal title="Chỉnh sửa hồ sơ" eyebrow="TÀI KHOẢN CÁ NHÂN" onClose={() => setEditing(false)}><form onSubmit={saveProfile} className="space-y-4"><div className="flex items-center gap-4"><div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-red-500 to-amber-500">{form.avatar ? <img src={form.avatar} alt="Xem trước ảnh đại diện" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-2xl font-black">{(form.hoTen || "U").slice(0, 1).toUpperCase()}</span>}</div><div><input ref={fileRef} type="file" accept="image/*" onChange={selectAvatar} className="hidden" /><button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">Đổi ảnh đại diện</button><p className="mt-1 text-xs text-slate-500">JPG, PNG hoặc WEBP · tối đa 2MB</p></div></div>{[["hoTen", "Họ và tên"], ["email", "Email"], ["soDt", "Số điện thoại"]].map(([name, label]) => <label key={name} className="block text-sm text-slate-300">{label}<input required={name !== "soDt"} value={form[name] || ""} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-2" /></label>)}<div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-white/10 px-5 py-3 font-bold">Hủy</button><button disabled={saving} className="rounded-xl bg-red-500 px-5 py-3 font-black disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div></form></Modal>}
    {confirmId && <ConfirmDialog title="Xóa lịch sử đặt vé?" message="Vé sẽ bị xóa khỏi tài khoản và ghế của vé sẽ được giải phóng để người khác có thể đặt. Bạn có chắc chắn muốn tiếp tục?" confirmLabel="Xóa vé" busy={deletingId === confirmId} onConfirm={removeHistory} onClose={() => setConfirmId(null)} />}
  </main>;
}

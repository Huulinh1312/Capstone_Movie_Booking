import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { bookingApi } from "../api/showtimesApi";
import { selectorIsLoggedIn } from "../store/authSlice";
import ToastMessage from "../components/ToastMessage";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

export default function BookingPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const loggedIn = useSelector(selectorIsLoggedIn);
  const [room, setRoom] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const timer = window.setTimeout(() => setToast((current) => ({ ...current, visible: false })), 3000);
    return () => window.clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (type, toastMessage) => {
    setToast({ visible: true, type, message: toastMessage });
  };

  const loadSeats = async () => {
    try {
      setMessage("");
      const { data } = await bookingApi.getSeats(showtimeId);
      setRoom(data?.data || data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể tải sơ đồ phòng chiếu.");
    }
  };

  useEffect(() => {
    // The loader is intentionally recreated with the showtime context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSeats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showtimeId]);

  const seats = room?.danhSachGhe || [];
  const selectedSeats = seats.filter((seat) => selectedIds.includes(seat.id));
  const ticketPrice = room?.thongTinPhim?.ticketPrice || room?.thongTinPhim?.giaVe || 90000;
  const total = useMemo(() => selectedSeats.length * ticketPrice, [selectedSeats.length, ticketPrice]);

  const toggleSeat = (seat) => {
    if (seat.daDat) return;
    setSelectedIds((current) => current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id]);
  };

  const submit = async () => {
    if (!loggedIn) { navigate("/login"); return; }
    if (!selectedSeats.length) { showToast("error", "Vui lòng chọn ít nhất một ghế."); return; }
    try {
      setSubmitting(true); setMessage("");
      await bookingApi.book(showtimeId, selectedSeats.map((seat) => ({ ...seat, price: ticketPrice })));
      setSelectedIds([]); showToast("success", "Đặt vé thành công! Ghế của bạn đã được xác nhận."); await loadSeats();
    } catch (error) {
      showToast("error", error.response?.status === 409 ? "Ghế vừa được người khác đặt. Vui lòng tải lại sơ đồ ghế." : error.response?.data?.message || "Đặt vé thất bại.");
      if (error.response?.status === 409) await loadSeats();
    } finally { setSubmitting(false); }
  };

  if (!room) return <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#070b14] px-4 text-slate-400"><div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/bg-booking.png')" }} /><div className="relative rounded-2xl border border-white/10 bg-[#111827]/90 p-8 text-center shadow-2xl">{message || "Đang tải sơ đồ ghế..."}</div></main>;

  return <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-8">
    <ToastMessage visible={toast.visible} type={toast.type} message={toast.message} />
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Cineverse / Seat selection</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{room.thongTinPhim?.name || "Chọn ghế của bạn"}</h1><p className="mt-2 text-sm text-slate-400">Lịch chiếu #{showtimeId} · Chọn ghế trống để tiếp tục</p></div>
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-right"><p className="text-xs text-slate-400">Tổng thanh toán</p><p className="text-xl font-black text-amber-300">{money(total)}</p></div>
      </div>
      {message && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{message}</p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-5 sm:p-8">
          <div className="mx-auto mb-10 max-w-2xl text-center"><div className="h-2 rounded-full bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_20px_#ef4444]" /><p className="mt-3 text-[11px] font-bold uppercase tracking-[.3em] text-slate-400">Màn hình / Screen</p><p className="mt-1 text-[10px] text-slate-600">Phía trước phòng chiếu</p></div>
          <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">{seats.map((seat) => { const selected = selectedIds.includes(seat.id); const vip = seat.type?.toLowerCase() === "vip"; return <button key={seat.id} disabled={seat.daDat} onClick={() => toggleSeat(seat)} title={seat.daDat ? "Đã đặt" : seat.name} className={`aspect-square rounded-md text-[10px] font-bold transition sm:text-xs ${seat.daDat ? "cursor-not-allowed bg-slate-800 text-slate-600 line-through" : selected ? "scale-105 bg-red-500 text-white shadow-[0_0_14px_#ef4444]" : vip ? "border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/50" : "border border-white/10 bg-slate-700 text-slate-200 hover:bg-slate-600"}`}>{seat.name || seat.code}</button>; })}</div>
          <div className="mt-10 flex flex-wrap justify-center gap-5 border-t border-white/10 pt-5 text-xs text-slate-400"><span>⬛ Ghế thường</span><span className="text-amber-300">⬛ Ghế VIP</span><span className="text-red-400">⬛ Đang chọn</span><span className="text-slate-600">✕ Đã đặt</span></div>
        </section>
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#111827] p-6 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Vé điện tử</p><h2 className="mt-2 text-xl font-black">{room.thongTinPhim?.name || "Movie Booking"}</h2><p className="mt-2 text-sm text-slate-400">Ghế đã chọn ({selectedSeats.length})</p><div className="my-4 flex min-h-12 flex-wrap gap-2">{selectedSeats.length ? selectedSeats.map((seat) => <span key={seat.id} className="rounded-md bg-red-500/20 px-2 py-1 text-sm text-red-200">{seat.name || seat.code}</span>) : <span className="text-sm text-slate-500">Chưa chọn ghế</span>}</div><div className="flex justify-between border-t border-white/10 pt-4 text-sm text-slate-300"><span>Giá vé</span><span>{money(ticketPrice)} × {selectedSeats.length}</span></div><div className="mt-2 flex justify-between text-lg font-black"><span>Tổng cộng</span><span className="text-amber-300">{money(total)}</span></div><button disabled={submitting} onClick={submit} className="mt-6 w-full rounded-xl bg-red-500 py-3 font-bold shadow-lg shadow-red-500/20 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Đang xử lý..." : "Xác nhận đặt vé →"}</button><p className="mt-4 text-center text-xs leading-5 text-slate-500">Bạn cần đăng nhập trước khi xác nhận đặt vé.</p>
        </aside>
      </div>
    </div>
  </main>;
}

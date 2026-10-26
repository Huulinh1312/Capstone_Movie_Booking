import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingApi } from "../api/showtimesApi";
import { useSelector } from "react-redux";
import { selectorIsLoggedIn } from "../store/authSlice";

export default function BookingPage() {
  const { showtimeId } = useParams(); const navigate = useNavigate(); const loggedIn = useSelector(selectorIsLoggedIn);
  const [data, setData] = useState(null); const [selected, setSelected] = useState([]); const [error, setError] = useState(""); const [done, setDone] = useState("");
  useEffect(() => { bookingApi.getSeats(showtimeId).then(({ data: value }) => setData(value)).catch((e) => setError(e.response?.data?.message || "Không tải được sơ đồ ghế")); }, [showtimeId]);
  const total = useMemo(() => selected.length * (data?.showtime?.ticketPrice || 90000), [selected, data]);
  const toggle = (seat) => { if (seat.daDat) return; setSelected((current) => current.some((s) => s.id === seat.id) ? current.filter((s) => s.id !== seat.id) : [...current, seat]); };
  const submit = async () => { if (!loggedIn) { navigate("/login"); return; } if (!selected.length) return setError("Hãy chọn ít nhất một ghế"); try { await bookingApi.book(showtimeId, selected); setDone("Đặt vé thành công"); setSelected([]); const fresh = await bookingApi.getSeats(showtimeId); setData(fresh.data); } catch (e) { setError(e.response?.data?.message || "Đặt vé thất bại"); } };
  if (!data) return <p className="p-10">{error || "Đang tải sơ đồ ghế..."}</p>;
  return <main className="min-h-screen bg-cover bg-center px-4 py-12" style={{ backgroundImage: "linear-gradient(#000b,#000b),url('/bg-booking.png')" }}><div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">{data.thongTinPhim?.name}</h1><p className="mt-2 text-slate-300">Chọn ghế · Lịch chiếu #{showtimeId}</p>{(error || done) && <p className={done ? "my-4 text-emerald-300" : "my-4 text-red-300"}>{done || error}</p>}<div className="mx-auto mt-10 max-w-3xl rounded-t-[50%] bg-amber-400/80 py-2 text-center text-black">MÀN HÌNH</div><div className="mx-auto mt-8 grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-8 md:grid-cols-10">{data.danhSachGhe?.map((seat) => <button key={seat.id} disabled={seat.daDat} onClick={() => toggle(seat)} className={`rounded-lg p-2 text-sm ${seat.daDat ? "bg-slate-600 text-slate-400" : selected.some((s) => s.id === seat.id) ? "bg-red-500" : "bg-slate-800 hover:bg-red-400"}`}>{seat.name}</button>)}</div><aside className="mx-auto mt-10 max-w-xl rounded-2xl bg-slate-900 p-5"><p>Đã chọn: {selected.map((s) => s.name).join(", ") || "Chưa chọn"}</p><p className="my-3 text-xl font-bold">Tổng: {total.toLocaleString("vi-VN")}đ</p><button onClick={submit} className="w-full rounded-lg bg-red-600 py-3">Xác nhận đặt vé</button></aside></div></main>;
}

import React, { useState, useEffect } from "react";
import { useProfile } from "../hooks/useUser";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorIsLoggedIn } from "../store/authSlice";

const ProfilePage = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const { data: profile, isLoading, isError } = useProfile(isLoggedIn);
  const [user, setUser] = useState(profile);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bookingHistory");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) setBookingHistory(arr);
    } catch (err) {
      console.error("Error loading booking history", err);
    }
  }, []);

  const handleDownload = (ticket) => {
    try {
      const contentLines = [];
      contentLines.push('MÃ VÉ: ' + (ticket.maVe || ''));
      contentLines.push('PHIM: ' + (ticket.tenPhim || ''));
      contentLines.push('RẠP: ' + (ticket.tenCumRap || '') + ' - ' + (ticket.tenRap || ''));
      contentLines.push('NGÀY: ' + (ticket.ngayChieu || '') + ' ' + (ticket.gioChieu || ''));
      contentLines.push('TỔNG: ' + (ticket.total ? ticket.total.toLocaleString() : ticket.total) + ' ₫');
      contentLines.push('GHẾ:');
      (ticket.seats || []).forEach(function (s) {
        contentLines.push(' - ' + s.soGhe + ' (' + (s.gia ? s.gia.toLocaleString() : s.gia) + ' ₫)');
      });

      var blob = new Blob([contentLines.join('\n')], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ticket_' + (ticket.maVe || ticket.id) + '.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading ticket', err);
      alert('Không thể tải vé lúc này.');
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Xóa vé này khỏi lịch sử?')) return;
    try {
      var key = 'bookingHistory';
      var raw = localStorage.getItem(key);
      var arr = raw ? JSON.parse(raw) : [];
      var filtered = arr.filter(function (t) { return t.id !== id; });
      localStorage.setItem(key, JSON.stringify(filtered));
      setBookingHistory(filtered);
    } catch (err) {
      console.error('Error deleting ticket', err);
      alert('Xóa thất bại.');
    }
  };

  // format avatar
  // string là tập hợp các ký tự
  const avatar = profile?.hoTen[0].toUpperCase();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/70 z-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-3xl font-bold flex-shrink-0">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {profile?.hoTen}
                </h1>
              </div>
              <p className="text-gray-400 text-sm">@adminbt</p>
            </div>
            {profile?.maLoaiNguoiDung === "QuanTri" && (
              <Link
                to="/admin"
                className="flex-shrink-0 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                ⚙️ Trang quản trị
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="text-white text-sm">newUser@gmail.com</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                Số điện thoại
              </p>
              <p className="text-white text-sm">0909099809</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                Nhóm
              </p>
              <p className="text-white text-sm">GP01</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">
            Lịch sử đặt vé
            <span className="text-gray-500 text-sm font-normal ml-2">
              ({bookingHistory.length} vé)
            </span>
          </h2>
          <div className="space-y-4">
            {bookingHistory.length === 0 && (
              <div className="text-gray-400">Bạn chưa có lịch sử đặt vé.</div>
            )}

            {bookingHistory.map(function (ticket) {
              return (
                <div key={ticket.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-400/30 transition-colors">
                  <div className="flex items-start justify-between p-4 gap-4">
                    <div className="flex gap-4 flex-1">
                      {ticket.hinhAnh ? (
                        <img
                          src={ticket.hinhAnh}
                          alt={ticket.tenPhim}
                          className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-gray-800 rounded-xl flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-white font-semibold text-lg leading-tight">
                            {ticket.tenPhim || 'Phim'}
                          </h3>
                          <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">
                            {ticket.total ? ticket.total.toLocaleString() : '0'} ₫
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                          <span>🗓 {ticket.ngayChieu} {ticket.gioChieu}</span>
                          <span>⏱ 120 phút</span>
                          <span className="text-gray-600">Mã vé: {ticket.maVe}</span>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1.5">
                            📍 {ticket.tenCumRap} — {ticket.tenRap}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(ticket.seats || []).map(function (s) {
                              return (
                                <span key={s.soGhe} className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">
                                  Ghế {s.soGhe}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <button onClick={() => handleDownload(ticket)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        Tải vé
                      </button>

                      <button onClick={() => handleDelete(ticket.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        Xóa lịch sử
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

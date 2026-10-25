import { useEffect, useMemo, useRef, useState } from "react";
import { showtimesApi } from "../../api/showtimesApi";
import ToastMessage from "../../components/ToastMessage";

const MOVIES_PER_PAGE = 4;

const ShowtimesPage = () => {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimer = useRef(null);
  const [createForm, setCreateForm] = useState({
    maPhim: "",
    maRap: "",
    ngayChieuGioChieu: "",
    giaVe: "",
    maNhom: "GP01",
  });

  useEffect(() => {
    fetchShowtimes();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const fetchShowtimes = async () => {
    try {
      const res = await showtimesApi.getShowtimesBySystem("GP01");
      const data = res.data.content || [];
      setSystems(data);

      if (data.length > 0) {
        const firstSystem = data[0];
        const firstCinema = firstSystem.lstCumRap?.[0] || null;
        setSelectedSystem(firstSystem);
        setSelectedCinema(firstCinema);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const movies = selectedCinema?.danhSachPhim || [];
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));

  const currentMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return movies.slice(start, start + MOVIES_PER_PAGE);
  }, [movies, currentPage]);

  const handleOpenCreateModal = () => {
    setCreateForm((f) => ({
      ...f,
      maPhim: selectedCinema?.danhSachPhim?.[0]?.maPhim || "",
      maRap:
        selectedCinema?.maCumRap ||
        selectedSystem?.lstCumRap?.[0]?.maCumRap ||
        "",
    }));
    setIsCreateModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const handleCreateShowtime = async () => {
    if (
      !createForm.maPhim ||
      !createForm.maRap ||
      !createForm.ngayChieuGioChieu
    ) {
      showToast("Vui lòng điền đủ thông tin", "error");
      return;
    }

    try {
      setCreating(true);
      const ngay = createForm.ngayChieuGioChieu;

      const payload = {
        maPhim: Number(createForm.maPhim),
        ngayChieuGioChieu: formatDate(createForm.ngayChieuGioChieu),
        maRap: createForm.maRap,
        giaVe: Number(createForm.giaVe),
      };
      const res = await showtimesApi.createShowtime(payload);
      console.log("Response:", res);
      await fetchShowtimes();
      setIsCreateModalOpen(false);
      showToast("Tạo lịch chiếu thành công", "success");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("Error:", err);
      showToast("Tạo lịch chiếu thất bại", "error");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 text-slate-300">
        Đang tải dữ liệu lịch chiếu...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100">
      <ToastMessage
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
      />
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
              Quản lý lịch chiếu
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Lịch chiếu theo hệ thống rạp
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Xem phim và tạo lịch chiếu nhanh chóng từ một giao diện tập trung.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            + Tạo lịch chiếu
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-3 shadow-lg shadow-slate-950/30">
          <div className="mb-3 px-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Hệ thống rạp
          </div>
          <div className="space-y-2">
            {systems.map((system) => (
              <button
                key={system.maHeThongRap}
                onClick={() => {
                  setSelectedSystem(system);
                  setSelectedCinema(system.lstCumRap?.[0] || null);
                  setCurrentPage(1);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                  selectedSystem?.maHeThongRap === system.maHeThongRap
                    ? "border-amber-400/40 bg-amber-400/10"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                }`}
              >
                <img
                  src={system.logo}
                  alt={system.tenHeThongRap}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-sm font-medium text-slate-200">
                  {system.tenHeThongRap}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/30">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedCinema?.tenCumRap || "Chọn cụm rạp"}
                </h2>
                <p className="text-sm text-slate-400">
                  Danh sách phim đang được phân bổ trong cụm rạp này.
                </p>
              </div>
              <select
                value={selectedCinema?.maCumRap || ""}
                onChange={(e) => {
                  const cinema = selectedSystem?.lstCumRap?.find(
                    (c) => c.maCumRap === e.target.value,
                  );
                  setSelectedCinema(cinema || null);
                  setCurrentPage(1);
                }}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
              >
                {selectedSystem?.lstCumRap?.map((cinema) => (
                  <option key={cinema.maCumRap} value={cinema.maCumRap}>
                    {cinema.tenCumRap}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <div
                    key={movie.maPhim}
                    className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-amber-400/40"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <img
                        src={movie.hinhAnh}
                        alt={movie.tenPhim}
                        className="h-40 w-full shrink-0 rounded-2xl object-cover sm:w-28"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {movie.tenPhim}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                              {movie.dangChieu
                                ? "Đang chiếu"
                                : "Phim sắp khởi chiếu"}
                            </p>
                          </div>
                          <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                            {movie.hot ? "Hot" : "Thông thường"}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {movie.lstLichChieuTheoPhim?.map((show) => (
                            <button
                              key={show.maLichChieu}
                              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
                            >
                              {new Date(show.ngayChieuGioChieu).toLocaleString(
                                "vi-VN",
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
                  Chưa có phim nào trong cụm rạp này.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium transition ${currentPage === page ? "bg-amber-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Tạo lịch chiếu mới
                </h2>
                <p className="text-sm text-slate-400">
                  Gắn phim vào cụm rạp trong một bước nhanh.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Phim
                </label>
                <select
                  value={createForm.maPhim}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, maPhim: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400"
                >
                  <option value="">-- Chọn phim --</option>
                  {selectedCinema?.danhSachPhim?.map((movie) => (
                    <option key={movie.maPhim} value={movie.maPhim}>
                      {movie.tenPhim}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Cụm rạp
                </label>
                <select
                  value={createForm.maRap}
                  onChange={(e) =>
                    setCreateForm((s) => ({ ...s, maRap: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400"
                >
                  <option value="">-- Chọn cụm rạp --</option>
                  {selectedSystem?.lstCumRap?.map((cinema) => (
                    <option key={cinema.maCumRap} value={cinema.maCumRap}>
                      {cinema.tenCumRap}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Ngày giờ chiếu
                </label>
                <input
                  type="datetime-local"
                  value={createForm.ngayChieuGioChieu}
                  onChange={(e) =>
                    setCreateForm((s) => ({
                      ...s,
                      ngayChieuGioChieu: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Giá vé
                </label>
                <input
                  type="number"
                  value={createForm.giaVe}
                  onChange={(e) =>
                    setCreateForm((s) => ({
                      ...s,
                      giaVe: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-5">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-2xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateShowtime}
                disabled={creating}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-75"
              >
                {creating ? "Đang tạo..." : "Tạo lịch chiếu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;

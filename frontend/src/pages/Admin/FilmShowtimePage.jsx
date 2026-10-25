import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { movieApi } from "../../api/movieApi";
import { showtimesApi } from "../../api/showtimesApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastMessage from "../../components/ToastMessage";

const FilmShowtimePage = () => {
  const { idFilm } = useParams();
  const navigate = useNavigate();
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [showDateTime, setShowDateTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(75000);

  const { data: movieDetail, isLoading: isMovieLoading } = useQuery({
    queryKey: ["movieDetail", idFilm],
    queryFn: async () => {
      const response = await movieApi.getMovieDetail(idFilm);
      return response.data.content;
    },
    enabled: !!idFilm,
    retry: 1,
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimer = useRef(null);

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

  const { data: systems, isLoading: isSystemLoading } = useQuery({
    queryKey: ["cinemaSystems"],
    queryFn: async () => {
      const response = await showtimesApi.getCinemaSystems();
      return response.data.content;
    },
    retry: 1,
  });

  const { data: cinemas } = useQuery({
    queryKey: ["cinemasBySystem", selectedSystem],
    queryFn: async () => {
      if (!selectedSystem) return [];
      const response = await showtimesApi.getCinemasBySystem(selectedSystem);
      return response.data.content;
    },
    enabled: !!selectedSystem,
    retry: 1,
  });

  const createShowtime = useMutation({
    mutationFn: (payload) => showtimesApi.createShowtime(payload),
  });

  useEffect(() => {
    if (systems && systems.length > 0 && !selectedSystem) {
      setSelectedSystem(systems[0].maHeThongRap);
    }
  }, [systems, selectedSystem]);

  useEffect(() => {
    if (cinemas && cinemas.length > 0 && !selectedCinema) {
      setSelectedCinema(cinemas[0].maCumRap);
    }
  }, [cinemas, selectedCinema]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    const dd = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = "00";

    return `${dd}/${MM}/${yyyy} ${hh}:${mm}:${ss}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!selectedCinema || !showDateTime) {
        showToast("Vui lòng chọn cụm rạp và thời gian chiếu", "error");
        return;
      }

      const ngay = showDateTime;

      const payload = {
        maPhim: Number(idFilm),
        ngayChieuGioChieu: formatDateTime(ngay),
        maRap: selectedCinema,
        giaVe: Number(ticketPrice),
      };

      console.log(payload);

      await createShowtime.mutateAsync(payload);
      showToast("Tạo lịch chiếu thành công", "success");
      setTimeout(() => navigate("/admin/showtimes"), 700);
    } catch (error) {
      console.error(error);
      showToast("Tạo lịch chiếu thất bại", "error");
    }
  };

  if (isMovieLoading || isSystemLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 text-slate-100">
      <ToastMessage
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
      />
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
              Tạo lịch chiếu cho phim
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {movieDetail?.tenPhim || "Phim"}
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/films")}
            className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Quay lại phim
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Thông tin phim
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {movieDetail?.tenPhim}
              </h2>
            </div>
            <span className="rounded-full bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300">
              Mã phim: {idFilm}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Ngày khởi chiếu</p>
              <p className="mt-2 text-base text-white">
                {movieDetail?.ngayKhoiChieu?.slice(0, 10)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Đánh giá</p>
              <p className="mt-2 text-base text-white">
                {movieDetail?.danhGia ?? "Chưa có"}
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            {movieDetail?.moTa}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20"
        >
          <h2 className="text-lg font-semibold text-white">
            Thiết lập lịch chiếu
          </h2>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Hệ thống rạp
            </label>
            <select
              value={selectedSystem}
              onChange={(event) => {
                setSelectedSystem(event.target.value);
                setSelectedCinema("");
              }}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-white outline-none focus:border-amber-400"
            >
              {systems?.map((system) => (
                <option key={system.maHeThongRap} value={system.maHeThongRap}>
                  {system.tenHeThongRap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Cụm rạp
            </label>
            <select
              value={selectedCinema}
              onChange={(event) => setSelectedCinema(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-white outline-none focus:border-amber-400"
            >
              {cinemas?.map((cinema) => (
                <option key={cinema.maCumRap} value={cinema.maCumRap}>
                  {cinema.tenCumRap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Ngày giờ chiếu
            </label>
            <input
              type="datetime-local"
              value={showDateTime}
              onChange={(event) => setShowDateTime(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Giá vé</label>
            <input
              type="number"
              min="50000"
              step="5000"
              value={ticketPrice}
              onChange={(event) => setTicketPrice(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/films")}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Tạo lịch chiếu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmShowtimePage;

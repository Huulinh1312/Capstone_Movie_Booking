import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showtimesApi } from "../api/showtimesApi";
import LoadingSpinner from "../components/LoadingSpinner";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await showtimesApi.getShowtimesByMovie(id);
        const movieData = res.data.content;

        setData(movieData);

        // default system
        setSelectedSystem(movieData?.heThongRapChieu?.[0] || null);

        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!data?.heThongRapChieu?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Phim này chưa có lịch chiếu
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* TOP INFO */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <img
          src={data?.hinhAnh}
          className="w-60 h-80 object-cover rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold mb-3">{data?.tenPhim}</h1>
          <p className="text-gray-400 mb-4">Chọn hệ thống rạp và giờ chiếu</p>
        </div>
      </div>

      {/* ===================== */}
      {/* 🎯 LIST HỆ THỐNG RẠP */}
      {/* ===================== */}
      <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
        {data?.heThongRapChieu?.map((system) => (
          <button
            key={system.maHeThongRap}
            onClick={() => setSelectedSystem(system)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition whitespace-nowrap ${
              selectedSystem?.maHeThongRap === system.maHeThongRap
                ? "bg-red-600 border-red-600"
                : "bg-gray-900 border-gray-700"
            }`}
          >
            <img src={system.logo} className="w-6 h-6" />
            {system.tenHeThongRap}
          </button>
        ))}
      </div>

      {/* ===================== */}
      {/* 🎯 SHOWTIME SECTION */}
      {/* ===================== */}
      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-5">
          {selectedSystem?.tenHeThongRap}
        </h2>

        <div className="space-y-5">
          {selectedSystem?.cumRapChieu?.map((cum) => (
            <div
              key={cum.maCumRap}
              className="border border-gray-800 rounded-lg p-4"
            >
              <p className="text-gray-300 mb-3 font-medium">{cum.tenCumRap}</p>

              <div className="flex flex-wrap gap-2">
                {cum?.lichChieuPhim?.map((show) => {
                  const date = new Date(show.ngayChieuGioChieu);

                  const ngay = date.toLocaleDateString("vi-VN");
                  const gio = date.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <button
                      key={show.maLichChieu}
                      onClick={() =>
                        navigate(`/booking/${show.maLichChieu}`, {
                          state: {
                            thongTinPhim: {
                              tenPhim: data?.tenPhim,
                              tenRap: selectedSystem?.tenHeThongRap,
                              tenCumRap: cum.tenCumRap,
                              ngayChieu: show.ngayChieuGioChieu,
                              gioChieu: gio,
                              hinhAnh: data?.hinhAnh,
                            },
                          },
                        })
                      }
                      className="
          px-3 py-2
          bg-red-600 hover:bg-red-700
          rounded-lg
          text-xs text-center
          leading-tight
          transition
          hover:scale-105
          shadow-md
        "
                    >
                      <div className="text-[10px] opacity-90">{ngay}</div>
                      <div className="font-bold">{gio}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;

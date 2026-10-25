import { useEffect, useState } from "react";
import { movieApi } from "../api/movieApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const TicketPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    movieApi.getMovieList().then((res) => {
      setMovies(res.data.content);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO HEADER */}
      <div className="relative px-6 py-10 md:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            🎟️ Movie Tickets
          </h1>

          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-xl">
            Chọn bộ phim yêu thích và đặt vé nhanh chóng chỉ với một cú click.
          </p>

          <div className="w-24 h-1 bg-red-600 mt-6 rounded"></div>
        </div>
      </div>

      {/* MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <div
              key={movie.maPhim}
              className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/20 hover:scale-[1.03] transition duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={movie.hinhAnh}
                  className="h-72 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="absolute top-2 left-2 flex gap-2">
                  {movie.hot && (
                    <span className="bg-red-600 text-[10px] px-2 py-1 rounded-full font-bold">
                      HOT
                    </span>
                  )}

                  {movie.dangChieu && (
                    <span className="bg-green-600 text-[10px] px-2 py-1 rounded-full font-bold">
                      NOW
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3">
                <h2 className="font-semibold text-sm truncate">
                  {movie.tenPhim}
                </h2>

                <button
                  onClick={() => navigate(`/ticket/${movie.maPhim}`)}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-medium transition active:scale-95"
                >
                  🎟 Đặt vé
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

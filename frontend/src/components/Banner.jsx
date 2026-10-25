import React, { useEffect, useState } from "react";

const banners = [
  {
    image: "https://movienew.cybersoft.edu.vn/hinhanh/ban-tay-diet-quy.png",
    title: "BÀN TAY DIỆT QUỶ",
    genre: "Kinh Dị • Hành Động",
    trailerUrl: "https://youtu.be/xOgySa1AJRk?si=iR43mcWRu-iBvB4W",
  },
  {
    image: "https://movienew.cybersoft.edu.vn/hinhanh/lat-mat-48h.png",
    title: "LẬT MẶT 48H",
    genre: "Hành Động • Tội Phạm",
    trailerUrl: "https://youtu.be/kBY2k3G6LsM?si=RjA6k0F2TG4UKLU9",
  },
  {
    image: "https://movienew.cybersoft.edu.vn/hinhanh/cuoc-chien-sinh-tu.png",
    title: "CUỘC CHIẾN SINH TỬ",
    genre: "Phiêu Lưu • Sinh Tồn",
    trailerUrl: "https://youtu.be/Eu9G8nO5-Ug?si=Oq47loGkETR8WTpx",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Slider */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="relative min-w-full h-full">
            {/* Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />

            {/* CONTENT (RESPONSIVE FIX) */}
            <div className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 max-w-[90%] md:max-w-2xl">
              <span className="px-3 md:px-4 py-1 md:py-2 bg-red-600 rounded-full text-white text-xs md:text-sm font-semibold">
                🎬 Sắp ra mắt
              </span>

              <h1 className="mt-3 md:mt-5 text-2xl sm:text-3xl md:text-7xl font-extrabold text-white leading-tight">
                {banner.title}
              </h1>

              <p className="mt-2 md:mt-3 text-sm md:text-lg text-gray-300">
                {banner.genre}
              </p>

              <p className="mt-3 md:mt-5 text-xs md:text-base text-gray-400 max-w-xl line-clamp-3 md:line-clamp-none">
                Trải nghiệm điện ảnh đỉnh cao với chất lượng hình ảnh sắc nét,
                âm thanh sống động và những bộ phim bom tấn hấp dẫn nhất.
              </p>

              {/* BUTTONS (RESPONSIVE STACK) */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5 md:mt-8">
                <a
                  href={banner.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 md:px-8 py-2 md:py-3 backdrop-blur-md bg-red-600 border border-white/20 rounded-xl text-white hover:bg-red-700 rounded-xl transition text-sm md:text-base w-full sm:w-auto"
                >
                  Xem Trailer
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARROWS (responsive nhỏ lại mobile) */}
      <button
        onClick={() =>
          setCurrent(current === 0 ? banners.length - 1 : current - 1)
        }
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-600 transition"
      >
        ❮
      </button>

      <button
        onClick={() => setCurrent((current + 1) % banners.length)}
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-600 transition"
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index
                ? "w-8 md:w-10 h-2 md:h-3 bg-red-500"
                : "w-2 md:w-3 h-2 md:h-3 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
};

export default Banner;

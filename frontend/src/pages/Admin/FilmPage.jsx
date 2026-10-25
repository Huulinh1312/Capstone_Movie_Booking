import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieListPhanTrang, useAddMovie, useDeleteMovie } from "../../hooks/useMovies";
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastMessage from "../../components/ToastMessage";

const addMovieSchema = Yup.object().shape({
  tenPhim: Yup.string().required("Tên phim không được để trống"),
  biDanh: Yup.string().required("Bí danh không được để trống"),
  hinhAnh: Yup.string().required("Hình ảnh không được để trống"),
  moTa: Yup.string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .required("Mô tả không được để trống"),
  ngayKhoiChieu: Yup.date()
    .typeError("Ngày khởi chiếu phải là ngày hợp lệ")
    .required("Ngày khởi chiếu không được để trống"),
  danhGia: Yup.number()
    .min(0, "Đánh giá phải từ 0 đến 10")
    .max(10, "Đánh giá phải từ 0 đến 10")
    .required("Đánh giá không được để trống"),
});

const FilmPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const PAGE_SIZE = 8;

  const { data, isLoading } = useMovieListPhanTrang(currentPage, PAGE_SIZE);
  const movies = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;

  const navigate = useNavigate();
  const addMovie = useAddMovie();
  const deleteMovie = useDeleteMovie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const toastTimer = useRef(null);

  const filteredMovies = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return movies;
    return movies.filter((movie) => movie.tenPhim?.toLowerCase().includes(keyword));
  }, [movies, searchTerm]);

  const stats = useMemo(() => {
    const hotCount = movies.filter((movie) => movie.hot).length;
    const upcomingCount = movies.filter((movie) => movie.sapChieu).length;
    return { hotCount, upcomingCount };
  }, [movies]);

  const formik = useFormik({
    initialValues: {
      tenPhim: "",
      biDanh: "",
      hinhAnh: "",
      moTa: "",
      ngayKhoiChieu: "",
      danhGia: 8,
      maNhom: "GP01",
      hot: false,
      sapChieu: false,
    },
    validationSchema: addMovieSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("tenPhim", values.tenPhim);
        formData.append("biDanh", values.biDanh);
        formData.append("moTa", values.moTa);
        formData.append("ngayKhoiChieu", values.ngayKhoiChieu);
        formData.append("danhGia", values.danhGia);
        formData.append("maNhom", values.maNhom);
        formData.append("hot", values.hot);
        formData.append("sapChieu", values.sapChieu);

        if (selectedImage) {
          formData.append("hinhAnh", selectedImage);
        }

        await addMovie.mutateAsync(formData);
        resetForm();
        setSelectedImage(null);
        setImagePreview(null);
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
        alert("Thêm phim thất bại: " + (error?.response?.data?.message || error.message));
      }
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("hinhAnh", file.name);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    }
  }, [])

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleDeleteMovie = async (maPhim, tenPhim) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phim "${tenPhim}"?`)) {
      return;
    }

    try {
      await deleteMovie.mutateAsync(maPhim);
      showToast("Xóa phim thành công", "success");
    } catch (error) {
      console.log(error);
      showToast(`Xóa phim thất bại: ${error?.response?.data?.message || error.message}`, "error");
    }
  };

  return (
    <div className="space-y-6">
      <ToastMessage visible={toast.visible} type={toast.type} message={toast.message} />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/70 z-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-400">Quản lý phim</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Danh sách phim</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Theo dõi, cập nhật và quản lý nội dung phim một cách trực quan hơn.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-72">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Tìm theo tên phim..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            </div>
            <button
              onClick={() => navigate("/admin/films/addnew")}
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              + Thêm phim
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Tổng phim</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Phim hot</p>
            <p className="mt-2 text-2xl font-semibold text-rose-400">{stats.hotCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Sắp chiếu</p>
            <p className="mt-2 text-2xl font-semibold text-sky-400">{stats.upcomingCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.maPhim} className="group rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/30 transition hover:-translate-y-1 hover:border-amber-400/50">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-900 sm:w-28">
                  <img src={movie.hinhAnh} alt={movie.tenPhim} className="h-full w-full object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{movie.tenPhim}</h3>
                      <p className="mt-1 text-sm text-slate-400">{movie.biDanh}</p>
                    </div>
                    <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                      {movie.danhGia}/10
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                    {movie.moTa || "Chưa có mô tả chi tiết."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {movie.hot && (
                      <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
                        Hot
                      </span>
                    )}
                    {movie.sapChieu && (
                      <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">
                        Sắp chiếu
                      </span>
                    )}
                    {!movie.hot && !movie.sapChieu && (
                      <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-400">
                        Đang chiếu
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-500">
                      Khởi chiếu: {new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition group-hover:opacity-100 md:opacity-100">
                    <button
                      onClick={() => navigate(`/admin/films/edit/${movie.maPhim}`)}
                      className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => navigate(`/admin/films/showtime/${movie.maPhim}`)}
                      className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                      Tạo lịch chiếu
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.maPhim, movie.tenPhim)}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center text-slate-400 xl:col-span-2">
            Không tìm thấy phim phù hợp.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
              page === currentPage ? "bg-amber-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau →
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Thêm phim mới</h3>
                <p className="text-sm text-slate-400">Điền thông tin để đưa phim vào hệ thống.</p>
              </div>
              <button onClick={handleCloseModal} className="text-xl text-slate-400 transition hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Tên phim *</label>
                  <input type="text" {...formik.getFieldProps("tenPhim")} placeholder="Nhập tên phim" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.tenPhim && formik.errors.tenPhim && <p className="mt-1 text-xs text-rose-400">{formik.errors.tenPhim}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Bí danh *</label>
                  <input type="text" {...formik.getFieldProps("biDanh")} placeholder="Nhập bí danh" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.biDanh && formik.errors.biDanh && <p className="mt-1 text-xs text-rose-400">{formik.errors.biDanh}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Mô tả *</label>
                <textarea {...formik.getFieldProps("moTa")} placeholder="Nhập mô tả phim" rows="3" className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                {formik.touched.moTa && formik.errors.moTa && <p className="mt-1 text-xs text-rose-400">{formik.errors.moTa}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Ngày khởi chiếu *</label>
                  <input type="date" {...formik.getFieldProps("ngayKhoiChieu")} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.ngayKhoiChieu && formik.errors.ngayKhoiChieu && <p className="mt-1 text-xs text-rose-400">{formik.errors.ngayKhoiChieu}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Đánh giá (0-10) *</label>
                  <input type="number" min="0" max="10" {...formik.getFieldProps("danhGia")} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.danhGia && formik.errors.danhGia && <p className="mt-1 text-xs text-rose-400">{formik.errors.danhGia}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Hình ảnh *</label>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="flex-1 cursor-pointer rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-center transition hover:border-amber-400/50">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <div className="text-sm text-slate-400">
                      {imagePreview ? <span className="text-emerald-400">✓ Đã chọn hình ảnh</span> : <span>Chọn hình ảnh</span>}
                    </div>
                  </label>
                  {imagePreview && (
                    <div className="h-28 w-20 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                      <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                {formik.touched.hinhAnh && formik.errors.hinhAnh && <p className="mt-1 text-xs text-rose-400">{formik.errors.hinhAnh}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-sm text-slate-300">
                  <input type="checkbox" {...formik.getFieldProps("hot")} className="h-4 w-4 rounded border-slate-600 bg-slate-800" />
                  <span>Phim hot</span>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-sm text-slate-300">
                  <input type="checkbox" {...formik.getFieldProps("sapChieu")} className="h-4 w-4 rounded border-slate-600 bg-slate-800" />
                  <span>Sắp chiếu</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button type="button" onClick={handleCloseModal} className="rounded-2xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white">
                  Hủy
                </button>
                <button type="submit" disabled={!formik.isValid || addMovie.isPending} className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-75">
                  {addMovie.isPending ? "Đang thêm..." : "Thêm phim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmPage;

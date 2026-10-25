import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddMovie } from "../../hooks/useMovies";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastMessage from "../../components/ToastMessage";

const addMovieSchema = Yup.object().shape({
  tenPhim: Yup.string().required("Tên phim không được để trống"),
  biDanh: Yup.string().required("Bí danh không được để trống"),
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

const AddFilmPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimer = useRef(null);
  const addMovie = useAddMovie();

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

  const formik = useFormik({
    initialValues: {
      tenPhim: "",
      biDanh: "",
      moTa: "",
      ngayKhoiChieu: "",
      danhGia: 8,
      maNhom: "GP01",
      hot: false,
      sapChieu: false,
      dangChieu: false,
    },
    validationSchema: addMovieSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("tenPhim", values.tenPhim);
        formData.append("biDanh", values.biDanh);
        formData.append("moTa", values.moTa);
        const date = new Date(values.ngayKhoiChieu);

        const ngayKhoiChieu = `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}/${date.getFullYear()}`;

        formData.append("ngayKhoiChieu", ngayKhoiChieu);
        formData.append("danhGia", values.danhGia);
        formData.append("maNhom", values.maNhom);
        formData.append("hot", values.hot);
        formData.append("sapChieu", values.sapChieu);
        formData.append("dangChieu", values.dangChieu);

        if (selectedImage) {
          formData.append("File", selectedImage, selectedImage.name);
        }

        await addMovie.mutateAsync(formData);
        resetForm();
        setSelectedImage(null);
        setImagePreview(null);
        showToast("Thêm phim thành công", "success");
        setTimeout(() => navigate("/admin/films"), 700);
      } catch (error) {
        console.error(error);
        showToast("Thêm phim thất bại", "error");
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <ToastMessage
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
      />
      {addMovie.isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70">
          <LoadingSpinner />
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
              Thêm phim mới
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Tạo phim theo admin
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/films")}
            className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
          <h2 className="text-lg font-semibold text-white">Ảnh hiển thị</h2>
          <div className="h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Chưa chọn ảnh
              </div>
            )}
          </div>
          <label className="block rounded-3xl border border-dashed border-slate-700 bg-slate-900 px-4 py-5 text-center text-sm text-slate-300 transition hover:border-amber-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            Chọn ảnh phim
          </label>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tên phim
              </label>
              <input
                type="text"
                {...formik.getFieldProps("tenPhim")}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
              />
              {formik.touched.tenPhim && formik.errors.tenPhim && (
                <p className="mt-1 text-xs text-rose-400">
                  {formik.errors.tenPhim}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Bí danh
              </label>
              <input
                type="text"
                {...formik.getFieldProps("biDanh")}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
              />
              {formik.touched.biDanh && formik.errors.biDanh && (
                <p className="mt-1 text-xs text-rose-400">
                  {formik.errors.biDanh}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Mô tả
            </label>
            <textarea
              {...formik.getFieldProps("moTa")}
              rows="5"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-white outline-none focus:border-amber-400"
            />
            {formik.touched.moTa && formik.errors.moTa && (
              <p className="mt-1 text-xs text-rose-400">{formik.errors.moTa}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Ngày khởi chiếu
              </label>
              <input
                type="date"
                {...formik.getFieldProps("ngayKhoiChieu")}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
              />
              {formik.touched.ngayKhoiChieu && formik.errors.ngayKhoiChieu && (
                <p className="mt-1 text-xs text-rose-400">
                  {formik.errors.ngayKhoiChieu}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Đánh giá
              </label>
              <input
                type="number"
                min="0"
                max="10"
                {...formik.getFieldProps("danhGia")}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
              />
              {formik.touched.danhGia && formik.errors.danhGia && (
                <p className="mt-1 text-xs text-rose-400">
                  {formik.errors.danhGia}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                {...formik.getFieldProps("hot")}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800"
              />
              Hot
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                {...formik.getFieldProps("sapChieu")}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800"
              />
              Sắp chiếu
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                {...formik.getFieldProps("dangChieu")}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800"
              />
              Đang chiếu
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate("/admin/films")}
              className="rounded-2xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Thêm phim
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFilmPage;

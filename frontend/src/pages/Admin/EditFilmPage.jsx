import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { movieApi } from "../../api/movieApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastMessage from "../../components/ToastMessage";

const editMovieSchema = Yup.object().shape({
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

const EditFilmPage = () => {
  const { idFilm } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const { data, isLoading } = useQuery({
    queryKey: ["movieDetail", idFilm],
    queryFn: async () => {
      const response = await movieApi.getMovieDetail(idFilm);
      return response.data.content;
    },
    enabled: !!idFilm,
    retry: 1,
  });

  const updateMovie = useMutation({
    mutationFn: (formData) => movieApi.updateMovieWithImage(formData),
  });

  const formik = useFormik({
    initialValues: {
      maPhim: data?.maPhim || 0,
      tenPhim: data?.tenPhim || "",
      biDanh: data?.biDanh || "",
      moTa: data?.moTa || "",
      ngayKhoiChieu: data?.ngayKhoiChieu ? data.ngayKhoiChieu.slice(0, 10) : "",
      danhGia: data?.danhGia || 0,
      maNhom: data?.maNhom || "GP01",
      hot: data?.hot || false,
      sapChieu: data?.sapChieu || false,
      dangChieu: data?.dangChieu || false,
      trailer: data?.trailer || "",
    },
    enableReinitialize: true,
    validationSchema: editMovieSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("maPhim", values.maPhim);
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
        formData.append("trailer", values.trailer);

        if (selectedImage) {
          formData.append("hinhAnh", selectedImage, selectedImage.name);
        }

        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        await updateMovie.mutateAsync(formData);
        showToast("Cập nhật phim thành công", "success");
        setTimeout(() => navigate("/admin/films"), 700);
      } catch (error) {
        console.error(error);
        showToast("Cập nhật phim thất bại", "error");
      }
    },
  });

  useEffect(() => {
    if (data && data.hinhAnh && !imagePreview) {
      setImagePreview(data.hinhAnh);
    }
  }, [data, imagePreview]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
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
              Chỉnh sửa phim
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {data?.tenPhim || "Phim mới"}
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
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
          <h2 className="text-lg font-semibold text-white">Ảnh phim</h2>
          <div className="h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Chưa có ảnh
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
            Chọn ảnh mới (không bắt buộc)
          </label>
        </div>

        <div className="lg:col-span-2 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
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
              Trailer
            </label>
            <input
              type="text"
              {...formik.getFieldProps("trailer")}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Mô tả
            </label>
            <textarea
              {...formik.getFieldProps("moTa")}
              rows="4"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-amber-400"
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
              Cập nhật phim
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditFilmPage;

import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { authApi } from "../api/authApi";

const registerSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .required("Mật khẩu không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  soDt: Yup.string()
    .matches(/^[0-9]{9,11}$/, "Số điện thoại phải từ 9 đến 11 chữ số")
    .required("Số điện thoại không được để trống"),
  hoTen: Yup.string().required("Họ tên không được để trống"),
  maNhom: Yup.string().required("Mã nhóm không được để trống"),
});

const RegisterPage = () => {
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      maNhom: "GP01",
      hoTen: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setApiError("");
      setApiSuccess("");

      try {
        await authApi.register(values);
        setApiSuccess("Đăng ký thành công. Đang chuyển sang trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        setApiError(error.response?.data?.content || "Đăng ký thất bại");
      }
    },
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative px-4 py-8"
      style={{
        backgroundImage: "url('/bg-login.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-4xl font-extrabold text-red-500 tracking-wide"
          >
            TLMovie
          </Link>

          <h2 className="text-white text-2xl font-bold mt-6">Tạo tài khoản mới</h2>

          <p className="text-gray-300 mt-2 text-sm leading-6">
            Điền đầy đủ thông tin để đăng ký và bắt đầu đặt vé.
          </p>
        </div>

        <div className="bg-[#1b1b1be6] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">
            Đăng ký
          </h2>

          <form onSubmit={formik.handleSubmit}>
            {apiError && (
              <div className="bg-red-600 text-white text-sm font-medium px-4 py-3 rounded-lg mb-5">
                {apiError}
              </div>
            )}

            {apiSuccess && (
              <div className="bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-lg mb-5">
                {apiSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tài khoản
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("taiKhoan")}
                  placeholder="Nhập tài khoản"
                  className="w-full bg-[#2b2b2b] text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />
                {formik.touched.taiKhoan && formik.errors.taiKhoan && (
                  <p className="text-red-400 text-sm mt-1">{formik.errors.taiKhoan}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("hoTen")}
                  placeholder="Nhập họ tên"
                  className="w-full bg-[#2b2b2b] text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />
                {formik.touched.hoTen && formik.errors.hoTen && (
                  <p className="text-red-400 text-sm mt-1">{formik.errors.hoTen}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="you@example.com"
                className="w-full bg-[#2b2b2b] text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("soDt")}
                  placeholder="Nhập số điện thoại"
                  className="w-full bg-[#2b2b2b] text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />
                {formik.touched.soDt && formik.errors.soDt && (
                  <p className="text-red-400 text-sm mt-1">{formik.errors.soDt}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mã nhóm
                </label>
                <select
                  {...formik.getFieldProps("maNhom")}
                  className="w-full bg-[#2b2b2b] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                >
                  <option value="GP01">GP01</option>
                  <option value="GP02">GP02</option>
                  <option value="GP03">GP03</option>
                  <option value="GP04">GP04</option>
                  <option value="GP05">GP05</option>
                  <option value="GP06">GP06</option>
                  <option value="GP07">GP07</option>
                  <option value="GP08">GP08</option>
                  <option value="GP09">GP09</option>
                  <option value="GP10">GP10</option>
                </select>
                {formik.touched.maNhom && formik.errors.maNhom && (
                  <p className="text-red-400 text-sm mt-1">{formik.errors.maNhom}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                {...formik.getFieldProps("matKhau")}
                placeholder="••••••••"
                className="w-full bg-[#2b2b2b] text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              />
              {formik.touched.matKhau && formik.errors.matKhau && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.matKhau}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg hover:shadow-red-500/30"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8">
            Đã có tài khoản?
            <Link
              to="/login"
              className="text-red-400 hover:text-red-500 font-semibold ml-2"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

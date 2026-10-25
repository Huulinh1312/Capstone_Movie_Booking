import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { authApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

const loginSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string().required("Mật khẩu không được để trống"),
});

const LoginPage = () => {
  const [apiError, setApiError] = useState("");

  // dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // hàm xử lý submit form
  const formik = useFormik({
    // giá trị ban đầu của form
    initialValues: {
      taiKhoan: "",
      matKhau: "",
    },
    // validation schema để validate form
    validationSchema: loginSchema,
    // hàm xử lý khi submit form
    onSubmit: async (values) => {
      setApiError(""); // reset lỗi cũ trước khi gọi API
      try {
        const response = await authApi.login(values);

        // dispatch
        dispatch(login(response.data.content));

        navigate("/"); // điều hướng về trang chủ sau khi đăng nhập thành công
      } catch (error) {
        console.log(error);
        setApiError(error.response?.data?.content);
      }
    },
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative px-4"
      style={{
        backgroundImage: "url('/bg-login.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="text-4xl font-extrabold text-red-500 tracking-wide"
          >
            TLMovie
          </a>

          <h2 className="text-white text-2xl font-bold mt-6">
            Chào mừng trở lại
          </h2>

          <p className="text-gray-300 mt-2 text-sm leading-6">
            Đăng nhập để tiếp tục thưởng thức những bộ phim mới nhất.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1b1b1be6] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">
            Đăng nhập
          </h2>

          <form onSubmit={formik.handleSubmit}>
            {apiError && (
              <div className="bg-red-600 text-white text-sm font-medium px-4 py-3 rounded-lg mb-5">
                {apiError}
              </div>
            )}

            {/* Tài khoản */}
            <div className="mb-5">
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
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
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
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.matKhau}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="accent-red-500" />
                Ghi nhớ đăng nhập
              </label>

              <a
                href="/"
                className="text-red-400 hover:text-red-500 transition"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg hover:shadow-red-500/30"
            >
              Đăng nhập
            </button>
          </form>

          {/* Bottom */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Chưa có tài khoản?
            <Link
              to="/register"
              className="text-red-400 hover:text-red-500 font-semibold ml-2"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAddUser, useDeleteUser, useUpdateUser, useUsers } from "../../hooks/useUser";
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastMessage from "../../components/ToastMessage";

const addUserSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  soDt: Yup.string().required("Số điện thoại không được để trống"),
  hoTen: Yup.string().required("Họ tên không được để trống"),
  maLoaiNguoiDung: Yup.string().required("Loại người dùng không được để trống"),
});

const updateUserSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
  soDt: Yup.string().required("Số điện thoại không được để trống"),
  hoTen: Yup.string().required("Họ tên không được để trống"),
  maLoaiNguoiDung: Yup.string().required("Loại người dùng không được để trống"),
});

const UserPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const toastTimer = useRef(null);
  const PAGE_SIZE = 8;

  const { data, isLoading } = useUsers(currentPage, PAGE_SIZE);
  const users = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;

  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const haystack = `${user.taiKhoan || ""} ${user.hoTen || ""} ${user.email || ""}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [users, searchTerm]);

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
      taiKhoan: selectedUser?.taiKhoan || "",
      matKhau: "",
      email: selectedUser?.email || "",
      soDt: selectedUser?.soDT || "",
      hoTen: selectedUser?.hoTen || "",
      maLoaiNguoiDung: selectedUser?.maLoaiNguoiDung || "KhachHang",
      maNhom: "GP01",
    },
    enableReinitialize: true,
    validationSchema: selectedUser ? updateUserSchema : addUserSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          taiKhoan: values.taiKhoan,
          email: values.email,
          soDt: values.soDt,
          hoTen: values.hoTen,
          maLoaiNguoiDung: values.maLoaiNguoiDung,
          maNhom: "GP01",
        };

        if (values.matKhau) {
          payload.matKhau = values.matKhau;
        }

        if (selectedUser) {
          await updateUser.mutateAsync(payload);
          showToast("Cập nhật người dùng thành công", "success");
        } else {
          payload.matKhau = values.matKhau;
          await addUser.mutateAsync(payload);
          showToast("Thêm người dùng thành công", "success");
        }

        resetForm();
        setSelectedUser(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        showToast(`Thao tác thất bại: ${error?.response?.data?.message || error.message}`, "error");
      }
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.hoTen || user.taiKhoan}"?`)) {
      return;
    }

    try {
      await deleteUser.mutateAsync(user.taiKhoan);
      showToast("Xóa người dùng thành công", "success");
    } catch (error) {
      console.error(error);
      showToast(`Xóa người dùng thất bại: ${error?.response?.data?.message || error.message}`, "error");
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
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-400">Quản lý người dùng</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Danh sách người dùng</h2>
            <p className="mt-2 text-sm text-slate-400">Theo dõi tài khoản khách hàng và quản trị viên cùng lúc.</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Tìm theo tên, tài khoản, email..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110">
              + Thêm người dùng
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Tổng tài khoản</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Phân loại</p>
            <p className="mt-2 text-2xl font-semibold text-amber-400">{users.filter((user) => user.maLoaiNguoiDung !== "KhachHang").length} quản trị</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.taiKhoan} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-sm font-semibold text-amber-300">
                    {user.hoTen?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.hoTen || user.taiKhoan}</h3>
                    <p className="text-sm text-slate-400">{user.taiKhoan}</p>
                  </div>
                </div>
                {user.maLoaiNguoiDung === "KhachHang" ? (
                  <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-300">Khách hàng</span>
                ) : (
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">Quản trị</span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p>📧 {user.email || "Chưa cập nhật"}</p>
                <p>📱 {user.soDT || "Chưa cập nhật"}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => handleEditUser(user)} className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700">Sửa</button>
                <button onClick={() => handleDeleteUser(user)} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700">Xóa</button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center text-slate-400 xl:col-span-2">
            Không tìm thấy người dùng phù hợp.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">← Trước</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`h-9 w-9 rounded-xl text-sm font-medium transition ${page === currentPage ? "bg-amber-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}>
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">Sau →</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>
                <p className="text-sm text-slate-400">{selectedUser ? "Cập nhật thông tin tài khoản." : "Tạo tài khoản mới cho hệ thống."}</p>
              </div>
              <button onClick={handleCloseModal} className="text-xl text-slate-400 transition hover:text-white">×</button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Tài khoản</label>
                  <input type="text" {...formik.getFieldProps("taiKhoan")} disabled={Boolean(selectedUser)} placeholder="Nhập tài khoản" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:bg-slate-800" />
                  {formik.touched.taiKhoan && formik.errors.taiKhoan && <p className="mt-1 text-xs text-rose-400">{formik.errors.taiKhoan}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Mật khẩu</label>
                  <input type="password" {...formik.getFieldProps("matKhau")} placeholder={selectedUser ? "Để trống nếu không đổi" : "••••••••"} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.matKhau && formik.errors.matKhau && <p className="mt-1 text-xs text-rose-400">{formik.errors.matKhau}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Họ tên</label>
                <input type="text" {...formik.getFieldProps("hoTen")} placeholder="Nhập họ tên" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                {formik.touched.hoTen && formik.errors.hoTen && <p className="mt-1 text-xs text-rose-400">{formik.errors.hoTen}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Email</label>
                <input type="email" {...formik.getFieldProps("email")} placeholder="example@email.com" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-rose-400">{formik.errors.email}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Số điện thoại</label>
                  <input type="text" {...formik.getFieldProps("soDt")} placeholder="0901234567" className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400" />
                  {formik.touched.soDt && formik.errors.soDt && <p className="mt-1 text-xs text-rose-400">{formik.errors.soDt}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Loại tài khoản</label>
                  <select {...formik.getFieldProps("maLoaiNguoiDung")} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-amber-400">
                    <option value="KhachHang">Khách hàng</option>
                    <option value="QuanTri">Quản trị</option>
                  </select>
                  {formik.touched.maLoaiNguoiDung && formik.errors.maLoaiNguoiDung && <p className="mt-1 text-xs text-rose-400">{formik.errors.maLoaiNguoiDung}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button type="button" onClick={handleCloseModal} className="rounded-2xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white">Hủy</button>
                <button type="submit" disabled={!formik.isValid} className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-75">{selectedUser ? "Cập nhật" : "Thêm người dùng"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;

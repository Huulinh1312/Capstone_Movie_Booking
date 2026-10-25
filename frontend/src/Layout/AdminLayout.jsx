import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../store/authSlice";

const AdminLayout = () => {
  const navLinkClassName = ({ isActive }) => {
    return isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20"
      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-slate-400 hover:bg-slate-800 hover:text-white";
  };

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    queryClient.refetchQueries({ queryKey: ["profile"] });
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827_45%,_#0f172a)] text-slate-100 flex">
      <aside
        className={`shrink-0 bg-slate-950/80 backdrop-blur border-r border-slate-800/80 flex flex-col transition-all ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="px-5 py-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-lg">
                🎬
              </div>
              {!collapsed && (
                <div>
                  <p className="text-lg font-semibold text-amber-400">TLMovie</p>
                  <p className="text-slate-500 text-xs mt-1">Admin Dashboard</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed((c) => !c)}
              className="text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-slate-600 text-[11px] uppercase tracking-[0.3em] px-4 mb-3">
            Quản lý
          </p>
          <NavLink to="/admin/users" className={navLinkClassName}>
            <span className="text-lg">👥</span>
            {!collapsed && "Người dùng"}
          </NavLink>
          <NavLink to="/admin/films" className={navLinkClassName}>
            <span className="text-lg">🎬</span>
            {!collapsed && "Phim"}
          </NavLink>
          <NavLink to="/admin/showtimes" className={navLinkClassName}>
            <span className="text-lg">🕐</span>
            {!collapsed && "Lịch chiếu"}
          </NavLink>
        </nav>

        <div className="px-3 pb-4 border-t border-slate-800/80 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <span>←</span>
            {!collapsed && "Về trang chủ"}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-950/70 backdrop-blur border-b border-slate-800/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="text-slate-400 hover:text-white p-2 rounded-lg sm:hidden"
            >
              ☰
            </button>

            <div>
              <h1 className="text-white font-semibold text-lg">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Quản trị hệ thống phim</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full max-w-xl justify-end">
            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Hệ thống đang hoạt động
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium">Admin User</p>
                <p className="text-amber-400 text-xs">Quản trị viên</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                A
              </div>
              <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

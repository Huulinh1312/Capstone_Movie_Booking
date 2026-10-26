import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectorIsLoggedIn, selectorUser } from "../store/authSlice";

export default function HomeLayout() {
  const loggedIn = useSelector(selectorIsLoggedIn);
  const user = useSelector(selectorUser);
  const dispatch = useDispatch();
  return <div className="min-h-screen bg-slate-950 text-white">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-black text-red-500">TLMovie</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/movies">Phim</Link><Link to="/cinemas">Rạp & lịch chiếu</Link>
          {loggedIn && <Link to="/profile">Tài khoản</Link>}
          {user?.maLoaiNguoiDung === "QuanTri" && <Link className="text-amber-300" to="/admin">Quản trị</Link>}
          {loggedIn ? <button onClick={() => dispatch(logout())} className="rounded bg-red-600 px-3 py-2">Đăng xuất</button> : <Link className="rounded bg-red-600 px-3 py-2" to="/login">Đăng nhập</Link>}
        </div>
      </nav>
    </header>
    <Outlet />
  </div>;
}

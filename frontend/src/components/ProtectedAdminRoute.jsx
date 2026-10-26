import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorUser } from "../store/authSlice";

export default function ProtectedAdminRoute({ children }) {
  const user = useSelector(selectorUser);
  return user?.maLoaiNguoiDung === "QuanTri" || user?.role === "ADMIN" ? children : <Navigate to="/" replace />;
}

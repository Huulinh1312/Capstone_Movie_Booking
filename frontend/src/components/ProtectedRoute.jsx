import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorIsLoggedIn } from "../store/authSlice";

export default function ProtectedRoute({ children }) {
  return useSelector(selectorIsLoggedIn) ? children : <Navigate to="/login" replace />;
}

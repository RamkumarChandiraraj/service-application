import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../useAuth";

export default function RequireAuth() {
  const { auth } = useAuth();
  return auth?.token ? <Outlet /> : <Navigate to="/signup" replace />;
}

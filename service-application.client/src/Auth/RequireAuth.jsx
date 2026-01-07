import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!auth) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ THIS IS REQUIRED
  return <Outlet />;
};

export default RequireAuth;

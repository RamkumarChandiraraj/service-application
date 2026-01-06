import { Navigate } from "react-router-dom";
import { useAuth } from "../useAuth";

export default function RequireManagementRole({ allowedRoles, children }) {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/signup" replace />;
  }

  return allowedRoles.includes(auth.role)
    ? children
    : <Navigate to="/unauthorized" replace />;
}

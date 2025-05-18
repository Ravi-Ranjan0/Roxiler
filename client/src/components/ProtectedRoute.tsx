import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { auth } = useAuth();

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

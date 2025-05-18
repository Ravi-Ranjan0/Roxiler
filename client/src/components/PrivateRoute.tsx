import { Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

type Role = "USER" | "ADMIN" | "STORE_OWNER";

type Props = {
  children: React.ReactNode;
  allowedRoles: Role[];
};

const PrivateRoute = ({ children, allowedRoles }: Props) => {
  const { auth } = useAuth();

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!auth.user || !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

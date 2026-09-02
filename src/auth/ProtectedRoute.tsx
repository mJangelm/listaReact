import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: Role;
}

function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, cargando } = useAuth();

  if (cargando) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

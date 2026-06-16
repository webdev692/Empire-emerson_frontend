import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Awaiting admin review — hold them on the pending screen
  if (user.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  // Rejected accounts cannot proceed
  if (user.status === 'rejected') {
    return <Navigate to="/login" replace />;
  }

  // Role restriction — send them to their own home, not the restricted page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const HOME: Record<string, string> = {
      admin:   "/admin",
      company: "/company",
      intern:  "/dashboard",
      school:  "/dashboard",
    };
    return <Navigate to={HOME[user.role] ?? "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

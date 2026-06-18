import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  mentorOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, mentorOnly }) => {
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (user.status === 'rejected') {
    return <Navigate to="/login" replace />;
  }

  // Mentor trying to access full admin panel → send to mentor dashboard
  if (user.role === 'admin' && user.is_mentor && allowedRoles?.includes('admin') && !mentorOnly) {
    return <Navigate to="/mentor" replace />;
  }

  // Non-mentor admin trying to access mentor routes → send to admin panel
  if (mentorOnly && (!user.is_mentor || user.role !== 'admin')) {
    return <Navigate to="/admin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const HOME: Record<string, string> = {
      admin:   user.is_mentor ? "/mentor" : "/admin",
      company: "/company",
      intern:  "/dashboard",
      school:  "/dashboard",
    };
    return <Navigate to={HOME[user.role] ?? "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

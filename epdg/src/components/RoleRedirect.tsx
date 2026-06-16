import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

const ROLE_DASHBOARDS: Record<Role, string> = {
  admin:   '/admin/dashboard',
  company: '/company/dashboard',
  intern:  '/intern/dashboard',
  school:  '/school/dashboard',
};

const RoleRedirect: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={ROLE_DASHBOARDS[user.role]} replace />;
};

export default RoleRedirect;

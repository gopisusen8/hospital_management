import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/jwtHelper';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const role = getRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboards based on role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/user/home" replace />;
  }

  return (
    <DashboardLayout user={user}>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;

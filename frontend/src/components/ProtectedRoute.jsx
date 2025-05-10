import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, role, children }) => {
  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a login
    return <Navigate to="/login" />;
  }

  if (role && role !== role) {
    // Si el rol no coincide, redirigir al dashboard
    return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} />;
  }

  return children;
};

export default ProtectedRoute;

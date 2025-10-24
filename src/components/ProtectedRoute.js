import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, currentUser }) => {
  const location = useLocation();
  if (!currentUser) {
    // Redirect to login with return url
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
};

export default ProtectedRoute;

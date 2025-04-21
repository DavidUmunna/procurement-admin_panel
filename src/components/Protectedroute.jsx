// src/components/ProtectedRoute.js
import { useUser } from './usercontext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
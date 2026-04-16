import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;

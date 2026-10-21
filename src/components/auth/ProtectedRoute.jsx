import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common';

const ProtectedRoute = ({ children, allowedRoles, allowedModule }) => {
  const { isAuthenticated, loading, role, userData } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (userData?.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  // Admin uchun modul darajasidagi cheklash
  if (allowedModule && role === 'admin' && Array.isArray(userData?.permissions)) {
    if (!userData.permissions.includes(allowedModule)) return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;

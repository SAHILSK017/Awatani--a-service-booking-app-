import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  // 🔥 Correct condition
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  switch (role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'worker':
      return <Navigate to="/worker/dashboard" replace />;
    case 'user':
      return <Navigate to="/user/home" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
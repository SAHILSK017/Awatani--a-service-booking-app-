import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Home from './pages/user/Home.jsx';
import Services from './pages/user/Services.jsx';
import Booking from './pages/user/Booking.jsx';
import MyBookings from './pages/user/MyBookings.jsx';
import WorkerDashboard from './pages/worker/WorkerDashboard.jsx';
import WorkerBookings from './pages/worker/WorkerBookings.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Users from './pages/admin/Users.jsx';
import AdminServices from './pages/admin/Services.jsx';
import AdminBookings from './pages/admin/Bookings.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardRedirect from './components/DashboardRedirect.jsx';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<DashboardRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/services" element={<Services />} />
        <Route path="/user/booking" element={<Booking />} />
        <Route path="/user/mybookings" element={<MyBookings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/bookings" element={<WorkerBookings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppContent;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/user/Home';
import Services from './pages/user/Services';
import Booking from './pages/user/Booking';
import MyBookings from './pages/user/MyBookings';
import Profile from './pages/user/Profile';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerAvailableJobs from './pages/worker/WorkerAvailableJobs';
import WorkerBookings from './pages/worker/WorkerBookings';
import WorkerEarnings from './pages/worker/WorkerEarnings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageWorkers from './pages/admin/ManageWorkers';
import AdminServices from './pages/admin/AdminServices';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/services" element={<Services />} />
        <Route path="/user/booking" element={<Booking />} />
        <Route path="/user/mybookings" element={<MyBookings />} />
        <Route path="/user/profile" element={<Profile />} />
        {/* Placeholder redirects for sidebar links */}
        <Route path="/user/*" element={<Home />} />
      </Route>

      {/* Worker Routes */}
      <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/available-jobs" element={<WorkerAvailableJobs />} />
        <Route path="/worker/bookings" element={<WorkerBookings />} />
        <Route path="/worker/earnings" element={<WorkerEarnings />} />
        <Route path="/worker/profile" element={<Profile />} />
        {/* Catch-all */}
        <Route path="/worker/*" element={<WorkerDashboard />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/workers" element={<ManageWorkers />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        {/* Catch-all */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

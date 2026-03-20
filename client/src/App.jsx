import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Enroll from './pages/Enroll';
import MyEnrollments from './pages/MyEnrollments';
import EnrollmentDetail from './pages/EnrollmentDetail';
import LogoutConfirm from './pages/LogoutConfirm';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminActivities from './pages/AdminActivities';
import AdminReview from './pages/AdminReview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/enroll/:id" element={<Enroll />} />
        <Route path="/my" element={<MyEnrollments />} />
        <Route path="/enrollment/:id" element={<EnrollmentDetail />} />
        <Route path="/logout" element={<LogoutConfirm />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="review" element={<AdminReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

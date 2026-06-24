import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicLayout from "../layouts/PublicLayout";
import ScrollToTop from "../components/common/ScrollToTop";

import HomePage from "../components/pages/HomePage";
import AboutPage from "../components/pages/AboutPage";
import AppointmentPage from "../components/pages/AppointmentPage";
import DoctorsPage from "../components/pages/DoctorsPage";
import DoctorProfilePage from "../components/pages/DoctorProfilePage";
import ServicesPage from "../components/pages/ServicesPage";
import NewsPage from "../components/pages/NewsPage";
import NewsDetailPage from "../components/pages/NewsDetailPage";
import ContactPage from "../components/pages/ContactPage";
import SearchResultsPage from "../components/pages/SearchResultsPage";

import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";

import PatientDashboard from "../components/dashboard/patient/PatientDashboard";
import AdminDashboard from "../components/dashboard/admin/AdminDashboard";

// Blocks access if not logged in
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Blocks access if not admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="specialties" element={<ServicesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:id" element={<DoctorProfilePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes — requires login */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes — requires admin role */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

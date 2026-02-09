import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AppPlaceholder from './pages/AppPlaceholder';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RoleBasedRedirect />} />
              <Route path="dashboard" element={<AppPlaceholder />} />
              <Route path="doctor-dashboard" element={<AppPlaceholder />} />
              <Route path="admin-dashboard" element={<AppPlaceholder />} />
              <Route path="profile" element={<AppPlaceholder />} />
              <Route path="doctor-profile" element={<AppPlaceholder />} />
              <Route path="appointments" element={<AppPlaceholder />} />
              <Route path="doctor-appointments" element={<AppPlaceholder />} />
              <Route path="doctors" element={<AppPlaceholder />} />
              <Route path="patients" element={<AppPlaceholder />} />
              <Route path="users" element={<AppPlaceholder />} />
              <Route path="admin-doctors" element={<AppPlaceholder />} />
              <Route path="admin-patients" element={<AppPlaceholder />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

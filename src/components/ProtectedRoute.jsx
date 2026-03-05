import { Navigate } from 'react-router-dom';
import { storageService } from '../services/api';

/**
 * Protected Route Component
 * Melindungi route agar hanya bisa diakses oleh user yang sudah login
 */
const ProtectedRoute = ({ children }) => {
  // Cek apakah user sudah login
  const isAuthenticated = storageService.isAuthenticated();
  
  // Jika belum login, redirect ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Jika sudah login, tampilkan konten
  return children;
};

export default ProtectedRoute;
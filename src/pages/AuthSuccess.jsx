import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ADMIN_EMAILS = ["admin@fintrix.com@gmail.com"]; // sama dengan AdminRoute.jsx

function AuthSuccess() {
  const location = useLocation();

  useEffect(() => {
    // Parse URL query params
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const email = searchParams.get("email"); // dikirim dari backend saat Google login

    if (token) {
      // Save tokens to localStorage
      localStorage.setItem("fintrix_token", token);
      if (refreshToken) {
        localStorage.setItem("fintrix_refresh_token", refreshToken);
      }

      // Cek admin langsung dari email di URL (tanpa fetch tambahan)
      const isAdmin = email && ADMIN_EMAILS.includes(email.toLowerCase());
      window.location.href = isAdmin ? "/admin/dashboard" : "/dashboard";
    } else {
      // If no token, redirect to login
      window.location.href = "/login?error=auth_failed";
    }
  }, [location]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-4">Authenticating...</h4>
        <p className="text-muted">Please wait while we log you in.</p>
      </div>
    </div>
  );
}

export default AuthSuccess;

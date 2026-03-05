import { Routes, Route } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Home Route with Navbar */}
        <Route
          path="/"
          element={
            <>
              <NavBarComponent />
              <HomePage />
            </>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <NavBarComponent />
                <DashboardPage />
              </>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5 pt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <button 
                className="btn-get-started"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
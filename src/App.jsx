import { Routes, Route } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FooterComponent from "./components/FooterComponent";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/"
          element={
            <>
              <NavBarComponent />
              <HomePage />
              <FooterComponent />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
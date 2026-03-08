import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  TrendingUp,
  Bell,
  Settings,
} from "lucide-react";

import "../styles/sidebar.css";

function SidebarComponent() {
  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-brand">
        <h2 className="brand-text">FINTRIX</h2>
        <hr />
      </div>

      <div className="sidebar-nav">
        <Nav className="flex-column">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <LayoutDashboard size={18} className="me-3" />
            Dashboard
          </NavLink>

          <NavLink to="/transactions" className="nav-link">
            <Receipt size={18} className="me-3" />
            Transaction
          </NavLink>

          <NavLink to="/analytics" className="nav-link">
            <BarChart3 size={18} className="me-3" />
            Analytics
          </NavLink>

          <NavLink to="/budget" className="nav-link">
            <Wallet size={18} className="me-3" />
            Budget
          </NavLink>

          <NavLink to="/investment" className="nav-link">
            <TrendingUp size={18} className="me-3" />
            Investment
          </NavLink>

          <NavLink to="/notifications" className="nav-link">
            <Bell size={18} className="me-3" />
            Notifications
          </NavLink>

          <NavLink to="/settings" className="nav-link">
            <Settings size={18} className="me-3" />
            Settings
          </NavLink>
        </Nav>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">A</div>

        <div className="profile-info">
          <p className="profile-name">Abdie</p>
          <p className="profile-email">abdie@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default SidebarComponent;

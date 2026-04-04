import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.jsx";
import { User, Mail, Lock, Eye, EyeOff, LogOut, Trash2, Shield, DollarSign, Globe, Sun, Moon, Monitor, Camera } from "lucide-react";
import "../../styles/SettingsPage.css";
import "../../styles/animations.css";

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme]               = useState("light");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initial  = (user?.name || "A").charAt(0).toUpperCase();
  const photoUrl = user?.profilePicture || user?.avatar || user?.picture || user?.photo || user?.photoUrl || user?.image || user?.profileImageUrl;

  return (
    <div className="d-flex settings-page">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-layout settings-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="dashboard-main p-4 p-md-5">
          <Container fluid className="px-0 px-md-3">

            {/* Header */}
            <div className="settings-header mb-4 anim-fade-up anim-d0">
              <h2 className="fw-bold m-0">Settings</h2>
              <p className="text-muted">Manage your account and application preferences</p>
            </div>

            <Row className="g-4">
              {/* LEFT COLUMN */}
              <Col xs={12} lg={5} xl={4}>

                {/* Profile Card */}
                <Card className="shadow-sm settings-card mb-4 card-hover anim-fade-left anim-d1">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold text-dark mb-1">Profile Settings</h5>
                    <p className="text-muted small mb-4">Update your profile information</p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative flex-shrink-0">
                        {photoUrl ? (
                          <img src={photoUrl} alt="Profile" className="settings-avatar" />
                        ) : (
                          <div className="settings-avatar-placeholder">{initial}</div>
                        )}
                        <div className="position-absolute settings-avatar-edit-btn">
                          <Camera size={14} />
                        </div>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 text-dark">{user?.name || "Abdie Rahman"}</h5>
                        <p className="text-muted small mb-2">{user?.email || "abdie@fintrix.co"}</p>
                        <Button className="settings-btn-edit-profile" size="sm">Edit Profile</Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-sm settings-card mb-4 card-hover anim-fade-left anim-d2">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold text-dark mb-1">Quick Actions</h5>
                    <p className="text-muted small mb-4">Account management</p>
                    <Button className="settings-btn-logout w-100 d-flex justify-content-center align-items-center fw-bold py-2 mb-3" onClick={handleLogout}>
                      <LogOut className="me-2" size={18} /> Logout
                    </Button>
                    <Button className="settings-btn-delete w-100 d-flex justify-content-center align-items-center fw-bold py-2">
                      <Trash2 className="me-2" size={18} /> Delete Account
                    </Button>
                  </Card.Body>
                </Card>

                {/* Data Secure Banner */}
                <Card className="shadow-sm settings-secure-banner card-hover-subtle anim-fade-left anim-d3">
                  <Card.Body className="p-4 d-flex align-items-start">
                    <Shield className="settings-secure-icon me-3 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h6 className="fw-bold mb-2 text-dark">Your data is secure</h6>
                      <p className="small mb-0 text-secondary" style={{ lineHeight: 1.5 }}>
                        All your financial data is encrypted and stored securely. We never share your information with third parties.
                      </p>
                    </div>
                  </Card.Body>
                </Card>

              </Col>

              {/* RIGHT COLUMN */}
              <Col xs={12} lg={7} xl={8}>

                {/* Account Settings Card */}
                <Card className="shadow-sm settings-card mb-4 card-hover anim-fade-right anim-d1">
                  <Card.Body className="p-4 p-md-5">
                    <h5 className="fw-bold text-dark mb-1">Account Settings</h5>
                    <p className="text-muted small mb-4">Manage your account credentials</p>
                    <Form>
                      {/* Full Name */}
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted fw-medium mb-1">Full Name</Form.Label>
                        <div className="input-group settings-input-group">
                          <span className="input-group-text pe-1 ps-3"><User size={18} /></span>
                          <Form.Control type="text" defaultValue={user?.name || "Abdie Rahman"} className="settings-form-control ps-2 py-2" />
                        </div>
                      </Form.Group>
                      {/* Username */}
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted fw-medium mb-1">Username</Form.Label>
                        <div className="input-group settings-input-group">
                          <span className="input-group-text pe-1 ps-3"><User size={18} /></span>
                          <Form.Control type="text" defaultValue="abdierahman" className="settings-form-control ps-2 py-2" />
                        </div>
                      </Form.Group>
                      {/* Email */}
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted fw-medium mb-1">Email Address</Form.Label>
                        <div className="input-group settings-input-group">
                          <span className="input-group-text pe-1 ps-3"><Mail size={18} /></span>
                          <Form.Control type="email" defaultValue={user?.email || "abdie@fintrix.co"} className="settings-form-control ps-2 py-2" />
                        </div>
                      </Form.Group>
                      {/* Password */}
                      <Form.Group className="mb-4">
                        <Form.Label className="small text-muted fw-medium mb-1">Password</Form.Label>
                        <div className="d-flex flex-column flex-sm-row gap-2 settings-pw-row">
                          <div className="input-group settings-input-group flex-grow-1">
                            <span className="input-group-text pe-1 ps-3"><Lock size={18} /></span>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              defaultValue="password123"
                              className="settings-form-control ps-2 py-2 fw-bold"
                              style={{ letterSpacing: !showPassword ? "2px" : "normal" }}
                            />
                            <span className="input-group-text settings-pw-toggle ps-1 pe-3" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                          </div>
                          <Button className="settings-btn-change-pw fw-bold px-4 py-2">Change Password</Button>
                        </div>
                      </Form.Group>
                      <Button className="settings-btn-save w-100 fw-bold py-2 rounded-3">Save Changes</Button>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Preferences Card */}
                <Card className="shadow-sm settings-card card-hover anim-fade-right anim-d2">
                  <Card.Body className="p-4 p-md-5">
                    <h5 className="fw-bold text-dark mb-1">Preferences</h5>
                    <p className="text-muted small mb-4">Manage currency, language and theme</p>

                    {/* Currency */}
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold mb-1 text-dark">Currency</Form.Label>
                      <div className="position-relative">
                        <span className="settings-select-icon"><DollarSign size={16} /></span>
                        <Form.Select className="settings-select ps-5 py-2" defaultValue="USD">
                          <option value="USD">USD</option>
                          <option value="IDR">IDR</option>
                          <option value="EUR">EUR</option>
                        </Form.Select>
                      </div>
                    </Form.Group>

                    {/* Language */}
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold mb-1 text-dark">Language</Form.Label>
                      <div className="position-relative">
                        <span className="settings-select-icon"><Globe size={16} /></span>
                        <Form.Select className="settings-select ps-5 py-2" defaultValue="en">
                          <option value="en">English</option>
                          <option value="id">Bahasa Indonesia</option>
                        </Form.Select>
                      </div>
                    </Form.Group>

                    {/* Theme */}
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-2 text-dark">Theme</Form.Label>
                      <div className="settings-theme-switcher">
                        {[
                          { key: "light",  label: "Light",  Icon: Sun },
                          { key: "dark",   label: "Dark",   Icon: Moon },
                          { key: "system", label: "System", Icon: Monitor },
                        ].map(({ key, label, Icon }) => (
                          <button
                            key={key}
                            type="button"
                            className={`settings-theme-btn ${theme === key ? "settings-theme-btn--active" : "settings-theme-btn--inactive"}`}
                            onClick={() => setTheme(key)}
                          >
                            <Icon size={15} className="me-2 mb-1" /> {label}
                          </button>
                        ))}
                      </div>
                    </Form.Group>
                  </Card.Body>
                </Card>

              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;

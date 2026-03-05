import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { navLinks } from '../data/index';
import { useState, useEffect } from 'react';
import { storageService } from '../services/api';

const NavBarComponent = () => {
  let navigate = useNavigate();
  const [changeColor, setChangeColor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const authStatus = storageService.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      setUser(storageService.getUser());
    }

    const changeBackgroundColor = () => {
      if (window.scrollY > 10) {
        setChangeColor(true);
      } else {
        setChangeColor(false);
      }
    };

    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);

    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, []);

  const handleLogout = () => {
    storageService.clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar expand="lg" className={changeColor ? "color-active" : ""} fixed="top">
      <Container>
        <Navbar.Brand href="/" className="fs-3 fw-bold">Fintrix</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto me-lg-4 text-center align-items-center">
            {navLinks.map((link) => {
              return (
                <div className="nav-link" key={link.id}>
                  <NavLink
                    to={link.path}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                    end
                  >
                    {link.title}
                  </NavLink>
                </div>
              );
            })}

            {isAuthenticated ? (
              <>
                <div className="nav-link">
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </div>
                <div className="dropdown ms-2">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: changeColor ? '#0f172a' : 'rgba(255,255,255,0.3)',
                      color: changeColor ? '#0f172a' : 'white'
                    }}
                  >
                    <span className="me-2">👤</span>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                    </li>
                    <li>
                      <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="btn-get-started"
                >
                  Get Started
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarComponent;
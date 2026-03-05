import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, storageService } from '../services/api';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import '../styles/auth.css';

// Icons Components
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

function LoginPage() {
  const [pwVisible, setPwVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authService.login(formData);
      
      storageService.setAuthData(
        response.data.data.token, 
        response.data.data.user
      );
      
      setSuccess('Login berhasil! Mengalihkan...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          'Login gagal. Silakan cek koneksi Anda.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('Google login akan segera tersedia');
  };

  return (
    <div className="auth-wrapper">
      {/* Left Sidebar */}
      <div className="auth-sidebar">
        <h1>Manage Your Money With Confidence</h1>
        <p className="sidebar-desc">
          Secure, intelligent financial management for modern users.
        </p>
        
        {/* Feature List */}
        <ul className="feature-list">
          <li>
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <span>Real-time expense tracking</span>
          </li>
          <li>
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <span>AI-powered financial insights</span>
          </li>
          <li>
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <span>Bank-level security</span>
          </li>
        </ul>

        {/* Decorative dots */}
        <div className="dot green dot-1" />
        <div className="dot green dot-2" />
        <div className="dot blue dot-3" />
        <div className="dot blue dot-4" />
      </div>

      {/* Right Main Content */}
      <div className="auth-main">
        <button className="btn-back" onClick={() => navigate("/")} type="button">
          ← Back to Home
        </button>

        <div className="form-box">
          {/* Brand */}
          <div className="brand">
            <h2>FINTRIX</h2>
            <div className="brand-line" />
          </div>

          {/* Header */}
          <div className="form-header">
            <h3>Welcome Back 👋</h3>
            <p>Sign in to continue managing your finances</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <Alert variant="danger" style={{ marginBottom: '20px' }} onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" style={{ marginBottom: '20px' }}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div className="input-box">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: loading ? '#f3f4f6' : 'white',
                    height: '45px'
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-box" style={{ position: 'relative' }}>
                <Form.Control
                  type={pwVisible ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: loading ? '#f3f4f6' : 'white',
                    height: '45px',
                    paddingRight: '40px'
                  }}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setPwVisible(!pwVisible)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  {pwVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </Form.Group>

            <div className="login-options">
              <Form.Check 
                type="checkbox" 
                label="Remember me" 
                disabled={loading}
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="success"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: '600',
                backgroundColor: '#22c55e',
                borderColor: '#22c55e',
                marginTop: '10px',
                fontSize: '16px'
              }}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: '8px' }}
                  />
                  Signing in...
                </>
              ) : 'Sign In'}
            </Button>
          </Form>

          {/* Separator */}
          <div className="separator">
            <span>Or continue with</span>
          </div>

          {/* Google Button */}
          <Button
            variant="light"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontWeight: '500',
              border: '1px solid #e2e8f0',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          {/* Switch to Register */}
          <p className="switch-page">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
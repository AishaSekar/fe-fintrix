import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-sidebar">
        <h1>Manage Your Money With Confidence</h1>
        <p className="sidebar-desc">
          Secure, intelligent financial management for modern users.
        </p>
      </div>

      <div className="auth-main">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="form-box">
          <div className="brand">
            <h2>FINTRIX</h2>
            <div className="brand-line" />
          </div>

          <div className="form-header">
            <h3>Welcome Back 👋</h3>
            <p>Sign in to continue managing your finances</p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email Address</label>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-box">
                <input
                  type={pwVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setPwVisible(!pwVisible)}
                  aria-label={pwVisible ? 'Hide password' : 'Show password'}
                >
                  {pwVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="separator">
            <span>Or continue with</span>
          </div>

          <button type="button" className="btn-google">
            <img src="/images/google logo.png" alt="Google" width={18} height={18} />
            Continue with Google
          </button>

          <p className="switch-page">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
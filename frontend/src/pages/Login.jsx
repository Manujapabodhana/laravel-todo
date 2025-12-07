import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, rememberMe });
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      // Use replace to prevent back button issues
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || "Login failed. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />
      <div className="auth-blob blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">NM</div>
          <div>
            <div className="auth-title">Welcome back</div>
            <div className="auth-subtitle">Sign in to your account</div>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <span style={{ opacity: 0.8 }}>Forgot password?</span>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

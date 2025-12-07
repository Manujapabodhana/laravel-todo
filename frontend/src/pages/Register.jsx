import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Register the user
      console.log("Registering user:", { name, email });
      const registerResponse = await api.post("/auth/register", { name, email, password, password_confirmation });
      console.log("Registration successful:", registerResponse.data);
      
      // Auto-login after successful registration
      console.log("Auto-logging in...");
      const loginResponse = await api.post("/auth/login", { email, password });
      console.log("Login successful:", loginResponse.data);
      
      const { access_token } = loginResponse.data;
      
      // Store token in localStorage
      localStorage.setItem("token", access_token);
      console.log("Token stored, redirecting to dashboard...");
      
      // Navigate to dashboard with full page reload to ensure App re-renders
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err?.response);
      
      // Parse error message properly
      let errorMessage = "Registration failed.";
      if (err?.response?.data) {
        const data = err.response.data;
        // Try to parse if it's a JSON string
        if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            errorMessage = Object.values(parsed).flat().join(", ");
          } catch {
            errorMessage = data;
          }
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = JSON.stringify(data);
        }
      }
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
            <div className="auth-title">Create account</div>
            <div className="auth-subtitle">
              Join us and start your journey
            </div>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.post("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-title">Dashboard</div>
        <button onClick={handleLogout} className="dashboard-btn">
          Logout
        </button>
      </nav>

      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-side">
          <div className="side-user">
            <div className="side-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="side-name">{user?.name || "User"}</div>
              <div className="side-email">{user?.email}</div>
            </div>
          </div>

          <div className="side-menu">
            <div className="side-item">Overview</div>
            <div className="side-item">Profile</div>
            <div className="side-item">Settings</div>
            <div className="side-item">Help</div>
          </div>
        </aside>

        {/* Content */}
        <main className="dashboard-content">
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">12</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tasks Done</div>
              <div className="stat-value">87</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Time</div>
              <div className="stat-value">4h 12m</div>
            </div>
          </div>

          <section className="big-card">
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
              Welcome 🎉
            </h2>
            <p style={{ opacity: 0.85 }}>
              You are logged in. This is your clean dashboard layout.  
              Add cards, charts, or tables here.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    window.location.href = "/login";
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        console.log("Loading user data...");
        const me = await api.post("/auth/me");
        console.log("User data received:", me.data);
        setUser(me.data);

        console.log("Loading tasks...");
        const res = await api.get("/tasks");
        console.log("Tasks received:", res.data);
        setTasks(res.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
        console.error("Error response:", err?.response);
        
        // Only logout if it's an authentication error
        if (err?.response?.status === 401) {
          console.log("Authentication failed, logging out...");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.error("Non-auth error, staying on dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/tasks", { title });
      setTasks((prev) => [res.data, ...prev]);
      setTitle("");
    } catch (err) {
      console.error("Add task error:", err);
      alert(err?.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
      alert(err?.response?.data?.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page" style={{display:"grid",placeItems:"center"}}>
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
        <aside className="dashboard-side">
          <div className="side-user">
            <div className="side-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="side-name">{user?.name}</div>
              <div className="side-email">{user?.email}</div>
            </div>
          </div>
        </aside>

        <main className="dashboard-content">
          <section className="big-card">
            <h2 style={{ marginTop: 0 }}>My Tasks</h2>

            <form onSubmit={addTask} style={{ display: "flex", gap: 10 }}>
              <input
                className="auth-input"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button className="auth-btn" style={{ width: 150 }}>
                Add Task
              </button>
            </form>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {tasks.length === 0 && (
                <p style={{ opacity: 0.7 }}>No tasks yet.</p>
              )}

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="stat-card"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{task.title}</div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

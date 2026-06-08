// pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logoArea}>
            <span style={styles.logoIcon}>💬</span>
            <h1 style={styles.logoText}>AI Chat</h1>
          </div>
          <p style={styles.tagline}>
            Join thousands of users having smarter conversations
          </p>
          <div style={styles.features}>
            <div style={styles.featureItem}>🔐 Secure Authentication</div>
            <div style={styles.featureItem}>💬 Real-time Messaging</div>
            <div style={styles.featureItem}>🤖 AI Powered Features</div>
            <div style={styles.featureItem}>🟢 Online Status</div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Sign up to get started for free</p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={styles.link}>
            Already have an account?{" "}
            <Link to="/login" style={styles.linkText}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "850px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.5s ease",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0084ff 0%, #0052cc 100%)",
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#fff",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  logoIcon: {
    fontSize: "36px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
  },
  tagline: {
    fontSize: "15px",
    opacity: 0.85,
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    fontSize: "14px",
    opacity: 0.9,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "10px 16px",
    borderRadius: "10px",
    backdropFilter: "blur(10px)",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "32px",
  },
  errorBox: {
    backgroundColor: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#0084ff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "24px",
    transition: "transform 0.2s, opacity 0.2s",
  },
  link: {
    textAlign: "center",
    fontSize: "14px",
    color: "#888",
  },
  linkText: {
    color: "#0084ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;
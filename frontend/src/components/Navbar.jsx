// components/Navbar.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    socket.disconnect();
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      {/* Left — Logo */}
      <div style={styles.left}>
        <span style={styles.logoIcon}>💬</span>
        <span style={styles.logoText}>AI Chat</span>
        <span style={styles.badge}>AI Powered</span>
      </div>

      {/* Right — User info + Logout */}
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.userStatus}>🟢 Online</span>
          </div>
        </div>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #0084ff 0%, #0052cc 100%)",
    padding: "12px 24px",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "24px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
  },
  badge: {
    fontSize: "11px",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "3px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "500",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.5)",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
  },
  userStatus: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.8)",
  },
  button: {
    padding: "8px 18px",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "background 0.2s",
  },
};

export default Navbar;
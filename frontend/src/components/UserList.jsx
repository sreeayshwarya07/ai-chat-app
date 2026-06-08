// components/UserList.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

const UserList = ({ selectedUser, setSelectedUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Contacts</h3>
        <span style={styles.count}>{users.length}</span>
      </div>

      {/* Search bar — visual only */}
      <div style={styles.searchBox}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search users..."
          readOnly
        />
      </div>

      {/* User List */}
      <div style={styles.list}>
        {users.length === 0 && (
          <p style={styles.noUsers}>No users found</p>
        )}

        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          const isSelected = selectedUser?._id === u._id;

          return (
            <div
              key={u._id}
              style={{
                ...styles.userItem,
                backgroundColor: isSelected ? "#e8f0fe" : "transparent",
                borderLeft: isSelected
                  ? "3px solid #0084ff"
                  : "3px solid transparent",
              }}
              onClick={() => setSelectedUser(u)}
            >
              {/* Avatar with online indicator */}
              <div style={styles.avatarWrapper}>
                <div style={{
                  ...styles.avatar,
                  backgroundColor: isSelected ? "#0084ff" : "#e2e8f0",
                  color: isSelected ? "#fff" : "#555",
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={{
                  ...styles.onlineDot,
                  backgroundColor: isOnline ? "#22c55e" : "#cbd5e0",
                }} />
              </div>

              {/* User info */}
              <div style={styles.info}>
                <div style={styles.nameRow}>
                  <p style={styles.name}>{u.name}</p>
                </div>
                <p style={{
                  ...styles.status,
                  color: isOnline ? "#22c55e" : "#999",
                }}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "280px",
    backgroundColor: "#fff",
    borderRight: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
  },
  header: {
    padding: "20px 16px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  count: {
    backgroundColor: "#0084ff",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "20px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    margin: "0 12px 12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    padding: "8px 12px",
    gap: "8px",
    border: "1px solid #eee",
  },
  searchIcon: {
    fontSize: "14px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "13px",
    color: "#666",
    width: "100%",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "4px 8px",
  },
  noUsers: {
    padding: "20px",
    color: "#999",
    fontSize: "14px",
    textAlign: "center",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: "12px",
    marginBottom: "4px",
    gap: "12px",
    transition: "all 0.2s",
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    transition: "all 0.2s",
  },
  onlineDot: {
    position: "absolute",
    bottom: "1px",
    right: "1px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  status: {
    fontSize: "12px",
    margin: 0,
    marginTop: "2px",
  },
};

export default UserList;
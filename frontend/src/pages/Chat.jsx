// pages/Chat.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../socket/socket";
import Navbar from "../components/Navbar";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import API from "../api/axios";

const Chat = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [taskPopup, setTaskPopup] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit("user_connected", user._id);

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receive_message", async (message) => {
      setMessages((prev) => [...prev, message]);

      // Mark messages as read immediately when received
      socket.emit("messages_read", {
        senderId: message.sender,
        receiverId: user._id,
      });

      try {
        const { data } = await API.post("/ai/detect-task", {
          message: message.text,
        });
        if (data.hasTask) setTaskPopup(data.task);
      } catch (error) {
        console.error("Task detection error:", error);
      }
    });

    // When receiver reads messages update ticks
    socket.on("messages_seen", ({ by }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.receiver === by || m.receiver?._id === by
            ? { ...m, isRead: true }
            : m
        )
      );
    });

    socket.on("user_typing", ({ senderId }) => {
      if (senderId === selectedUser?._id) setIsTyping(true);
    });

    socket.on("user_stop_typing", ({ senderId }) => {
      if (senderId === selectedUser?._id) setIsTyping(false);
    });

    return () => {
      socket.off("online_users");
      socket.off("receive_message");
      socket.off("messages_seen");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [user._id, selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    setIsTyping(false);
    setSummary("");
    setTaskPopup(null);

    const fetchMessages = async () => {
      try {
        const { data } = await API.get(`/messages/${selectedUser._id}`);
        setMessages(data);

        // Mark messages as read when opening a chat
        socket.emit("messages_read", {
          senderId: selectedUser._id,
          receiverId: user._id,
        });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser]);
  const sendMessage = async (text) => {
    if (!text.trim() || !selectedUser) return;
    try {
      const { data } = await API.post("/messages", {
        receiverId: selectedUser._id,
        text,
      });
      setMessages((prev) => [...prev, data]);
      socket.emit("send_message", {
        ...data,
        receiverId: selectedUser._id,
      });
      const taskResult = await API.post("/ai/detect-task", { message: text });
      if (taskResult.data.hasTask) setTaskPopup(taskResult.data.task);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) {
      alert("No messages to summarize!");
      return;
    }
    setLoadingSummary(true);
    setSummary("");
    try {
      const namedMessages = messages.map((m) => ({
        sender:
          m.sender === user._id || m.sender?._id === user._id
            ? user.name
            : selectedUser.name,
        text: m.text,
      }));
      const { data } = await API.post("/ai/summarize", {
        messages: namedMessages,
      });
      setSummary(data.summary);
    } catch (error) {
      console.error("Summarize error:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.body}>
        <UserList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />

        <div style={styles.chatArea}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.headerLeft}>
                  <div style={styles.headerAvatar}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.chatHeaderName}>{selectedUser.name}</p>
                    <p style={styles.chatHeaderStatus}>
                      {onlineUsers.includes(selectedUser._id) ? (
                        <span style={styles.onlineText}>🟢 Online</span>
                      ) : (
                        <span style={styles.offlineText}>⚫ Offline</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  style={styles.summarizeBtn}
                  onClick={handleSummarize}
                  disabled={loadingSummary}
                >
                  {loadingSummary ? "⏳ Summarizing..." : "📋 Summarize"}
                </button>
              </div>

              {/* Summary Box */}
              {summary && (
                <div style={styles.summaryBox}>
                  <div style={styles.summaryHeader}>
                    <p style={styles.summaryTitle}>📋 Chat Summary</p>
                    <button
                      style={styles.closeBtn}
                      onClick={() => setSummary("")}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={styles.summaryText}>{summary}</p>
                </div>
              )}

              {/* Task Popup */}
              {taskPopup && (
                <div style={styles.taskBox}>
                  <div style={styles.taskHeader}>
                    <p style={styles.taskTitle}>🔔 Reminder Detected!</p>
                    <button
                      style={styles.closeBtn}
                      onClick={() => setTaskPopup(null)}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={styles.taskText}>{taskPopup}</p>
                </div>
              )}

              <ChatWindow
                messages={messages}
                currentUser={user}
                isTyping={isTyping}
              />

              <MessageInput
                onSend={sendMessage}
                selectedUser={selectedUser}
                currentUser={user}
                messages={messages}
              />
            </>
          ) : (
            <div style={styles.placeholder}>
              <span style={styles.placeholderIcon}>💬</span>
              <p style={styles.placeholderText}>Select a conversation</p>
              <p style={styles.placeholderSubtext}>
                Choose a contact from the left to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafbfc",
  },
  chatHeader: {
    padding: "12px 24px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0084ff, #0052cc)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
  },
  chatHeaderName: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#1a1a1a",
    margin: 0,
  },
  chatHeaderStatus: {
    margin: 0,
    fontSize: "12px",
  },
  onlineText: {
    color: "#22c55e",
  },
  offlineText: {
    color: "#999",
  },
  summarizeBtn: {
    padding: "8px 16px",
    backgroundColor: "#f0f7ff",
    border: "1.5px solid #d0e8ff",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0084ff",
    transition: "all 0.2s",
  },
  summaryBox: {
    margin: "12px 16px 0",
    padding: "14px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "12px",
    animation: "fadeIn 0.3s ease",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  summaryTitle: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#92400e",
    margin: 0,
  },
  taskBox: {
    margin: "12px 16px 0",
    padding: "14px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "12px",
    animation: "fadeIn 0.3s ease",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  taskTitle: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#166534",
    margin: 0,
  },
  taskText: {
    fontSize: "14px",
    color: "#15803d",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
    fontWeight: "600",
  },
  summaryText: {
    fontSize: "14px",
    color: "#78350f",
    lineHeight: "1.6",
    margin: 0,
  },
  placeholder: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    color: "#999",
  },
  placeholderIcon: {
    fontSize: "64px",
    marginBottom: "8px",
  },
  placeholderText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#555",
    margin: 0,
  },
  placeholderSubtext: {
    fontSize: "14px",
    color: "#999",
    margin: 0,
  },
};

export default Chat;
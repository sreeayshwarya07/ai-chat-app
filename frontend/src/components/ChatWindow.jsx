// components/ChatWindow.jsx
import { useEffect, useRef } from "react";

const ChatWindow = ({ messages, currentUser, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    if (msgDate.toDateString() === today.toDateString()) return "Today";
    return msgDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  const getSenderId = (msg) => {
    if (typeof msg.sender === "object" && msg.sender !== null) {
      return (msg.sender._id || msg.sender).toString();
    }
    return msg.sender?.toString();
  };

  const getSenderName = (msg) => {
    if (typeof msg.sender === "object" && msg.sender !== null) {
      return msg.sender.name || "U";
    }
    return "U";
  };

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>👋</span>
          <p style={styles.emptyText}>No messages yet</p>
          <p style={styles.emptySubtext}>Say hello and start the conversation!</p>
        </div>
      )}

      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div style={styles.dateSeparator}>
            <div style={styles.dateLine} />
            <span style={styles.dateLabel}>{date}</span>
            <div style={styles.dateLine} />
          </div>

          {msgs.map((msg) => {
            const senderId = getSenderId(msg);
            const currentUserId = currentUser._id?.toString() || currentUser.id?.toString();
            const isMe = senderId === currentUserId;
            const senderName = getSenderName(msg);

            return (
              <div
                key={msg._id}
                className="message-animate"
                style={{
                  ...styles.messageRow,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <div style={styles.avatarSmall}>
                    {senderName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={styles.bubbleWrapper}>
                  <div
                    style={{
                      ...styles.bubble,
                      background: isMe
                        ? "linear-gradient(135deg, #0084ff, #0052cc)"
                        : "#f0f2f5",
                      color: isMe ? "#fff" : "#1a1a1a",
                      borderRadius: isMe
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      boxShadow: isMe
                        ? "0 2px 8px rgba(0,132,255,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <p style={styles.text}>{msg.text}</p>
                    <p style={{
                      ...styles.time,
                      color: isMe ? "rgba(255,255,255,0.7)" : "#999",
                    }}>
                      {formatTime(msg.createdAt)}
                      {isMe && (
                        <span style={styles.tick}>
                          {msg.isRead ? " ✓✓" : " ✓"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {isTyping && (
        <div style={styles.messageRow}>
          <div style={styles.typingBubble}>
            <span style={{ ...styles.dot, animationDelay: "0s" }} />
            <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
            <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    backgroundColor: "#fafbfc",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "80px",
    gap: "8px",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
    margin: 0,
  },
  emptySubtext: {
    fontSize: "13px",
    color: "#999",
    margin: 0,
  },
  dateSeparator: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "16px 0",
  },
  dateLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e2e8f0",
  },
  dateLabel: {
    fontSize: "12px",
    color: "#999",
    fontWeight: "500",
    whiteSpace: "nowrap",
    backgroundColor: "#fafbfc",
    padding: "0 8px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
    gap: "8px",
    marginBottom: "4px",
  },
  avatarSmall: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: "#555",
    flexShrink: 0,
  },
  bubbleWrapper: {
    maxWidth: "65%",
  },
  bubble: {
    padding: "10px 14px",
    wordBreak: "break-word",
  },
  text: {
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  time: {
    fontSize: "11px",
    marginTop: "4px",
    textAlign: "right",
    margin: "4px 0 0 0",
  },
  tick: {
    fontSize: "11px",
    marginLeft: "2px",
  },
  typingBubble: {
    backgroundColor: "#f0f2f5",
    borderRadius: "18px 18px 18px 4px",
    padding: "12px 16px",
    display: "flex",
    gap: "4px",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#999",
    display: "inline-block",
    animation: "bounce 1s infinite",
  },
};

export default ChatWindow;
// components/MessageInput.jsx
import { useState } from "react";
import socket from "../socket/socket";
import API from "../api/axios";

const MessageInput = ({ onSend, selectedUser, currentUser, messages }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  let typingTimeout = null;

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    setSuggestions([]);
    socket.emit("stop_typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const getSmartReplies = async () => {
    const lastMessage = [...messages]
      .reverse()
      .find(
        (m) =>
          m.sender === selectedUser._id ||
          m.sender?._id === selectedUser._id
      );

    if (!lastMessage) {
      alert("No message to reply to yet!");
      return;
    }

    setLoadingSuggestions(true);
    try {
      const { data } = await API.post("/ai/smart-reply", {
        lastMessage: lastMessage.text,
      });
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Smart reply error:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
    setSuggestions([]);
  };

  return (
    <div style={styles.wrapper}>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
  <div style={styles.suggestions}>
    <div style={styles.suggestionsHeader}>
      <p style={styles.suggestionsLabel}>✨ AI Suggestions</p>
      <button
        style={styles.closeSuggestionsBtn}
        onClick={() => setSuggestions([])}
      >
        ✕
      </button>
    </div>
    <div style={styles.suggestionButtons}>
      {suggestions.map((s, i) => (
        <button
          key={i}
          style={styles.suggestionBtn}
          onClick={() => handleSuggestionClick(s)}
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)}

      {/* Input Row */}
      <div style={styles.container}>
        {/* AI Button */}
        <button
          style={styles.aiButton}
          onClick={getSmartReplies}
          disabled={loadingSuggestions}
          title="Get AI suggestions"
        >
          {loadingSuggestions ? "⏳" : "✨"}
        </button>

        {/* Input */}
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
        />

        {/* Send Button */}
        <button
          style={{
            ...styles.button,
            opacity: text.trim() ? 1 : 0.6,
            transform: text.trim() ? "scale(1.05)" : "scale(1)",
          }}
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    borderTop: "1px solid #f0f0f0",
    backgroundColor: "#fff",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
  },
  suggestions: {
    padding: "12px 16px 8px",
    backgroundColor: "#f8f9ff",
    borderBottom: "1px solid #eef0ff",
  },
  suggestionsLabel: {
    fontSize: "12px",
    color: "#0084ff",
    fontWeight: "600",
    marginBottom: "8px",
  },
  suggestionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  suggestionBtn: {
    padding: "6px 14px",
    backgroundColor: "#fff",
    color: "#0084ff",
    border: "1.5px solid #0084ff",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  suggestionsHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
},
closeSuggestionsBtn: {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#0084ff",
  fontWeight: "600",
},
  container: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    gap: "10px",
  },
  aiButton: {
    width: "40px",
    height: "40px",
    backgroundColor: "#f0f7ff",
    border: "1.5px solid #d0e8ff",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "24px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
    transition: "border 0.2s",
  },
  button: {
    width: "44px",
    height: "44px",
    backgroundColor: "#0084ff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,132,255,0.4)",
  },
};

export default MessageInput;
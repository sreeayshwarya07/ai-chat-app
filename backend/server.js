// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketHandler = require("./socket/socketHandler");
const { getSmartReplies, summarizeChat, detectTasks } = require("./services/aiService");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// REST Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// AI Routes
// 1. Smart reply suggestions
app.post("/api/ai/smart-reply", protect, async (req, res) => {
  const { lastMessage } = req.body;
  const suggestions = await getSmartReplies(lastMessage);
  res.json({ suggestions });
});

// 2. Summarize conversation
app.post("/api/ai/summarize", protect, async (req, res) => {
  const { messages } = req.body;
  const summary = await summarizeChat(messages);
  res.json({ summary });
});

// 3. Detect tasks/reminders
app.post("/api/ai/detect-task", protect, async (req, res) => {
  const { message } = req.body;
  const result = await detectTasks(message);
  res.json(result);
});

// Socket.IO
socketHandler(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
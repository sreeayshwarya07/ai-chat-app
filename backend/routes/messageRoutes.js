// routes/messageRoutes.js
// Defines all /api/messages/* endpoints

const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// All message routes are protected — must be logged in
router.get("/:userId", protect, getMessages);  // GET /api/messages/:userId
router.post("/", protect, sendMessage);         // POST /api/messages

module.exports = router;
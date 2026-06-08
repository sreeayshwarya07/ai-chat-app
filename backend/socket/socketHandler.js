// socket/socketHandler.js
const User = require("../models/User");
const Message = require("../models/Message");

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    // User comes online
    socket.on("user_connected", async (userId) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log(`✅ User ${userId} is now online`);
    });

    // Send private message
    socket.on("send_message", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      }
    });

    // Mark messages as read
    socket.on("messages_read", async ({ senderId, receiverId }) => {
      try {
        // Mark all messages from sender to receiver as read
        await Message.updateMany(
          { sender: senderId, receiver: receiverId, isRead: false },
          { isRead: true }
        );

        // Tell sender their messages were read
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messages_seen", { by: receiverId });
        }
      } catch (error) {
        console.error("Read receipt error:", error);
      }
    });

    // Typing started
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          senderId: data.senderId,
        });
      }
    });

    // Typing stopped
    socket.on("stop_typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", {
          senderId: data.senderId,
        });
      }
    });

    // User goes offline
    socket.on("disconnect", async () => {
      let disconnectedUserId = null;
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }
      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
        io.emit("online_users", Array.from(onlineUsers.keys()));
        console.log(`❌ User ${disconnectedUserId} offline`);
      }
    });
  });
};

module.exports = socketHandler;
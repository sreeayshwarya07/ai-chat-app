const Message = require("../models/Message");

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  try {
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });
    const populatedMessage = await Message.findById(message._id).populate("sender", "name");
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage };
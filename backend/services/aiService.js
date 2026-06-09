// services/aiService.js
const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Feature 1: Generate 3 smart reply suggestions
const getSmartReplies = async (lastMessage) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Given a chat message, generate exactly 3 short and natural reply suggestions. Return ONLY a valid JSON array of 3 strings. No extra text. No explanation.",
        },
        {
          role: "user",
          content: `Message: "${lastMessage}"`,
        },
      ],
      max_tokens: 150,
    });
    const raw = response.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error("Smart reply error:", error.message);
    return ["Sure!", "Got it.", "Tell me more."];
  }
};

// Feature 2: Summarize a long conversation
const summarizeChat = async (messages) => {
  try {
    const chatText = messages
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Summarize the following chat conversation in 3-4 sentences.",
        },
        {
          role: "user",
          content: chatText,
        },
      ],
      max_tokens: 200,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Summarize error:", error.message);
    return "Could not summarize the conversation.";
  }
};

// Feature 3: Detect tasks or reminders
const detectTasks = async (message) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            'Check if this message contains a task or reminder. Return ONLY valid JSON: {"hasTask": true, "task": "description"} or {"hasTask": false, "task": ""}',
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 100,
    });
    const raw = response.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error("Task detect error:", error.message);
    return { hasTask: false, task: "" };
  }
};

module.exports = { getSmartReplies, summarizeChat, detectTasks };

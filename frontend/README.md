# 💬 AI Chat App

A full-stack real-time chat application with AI-powered features built with React, Node.js, MongoDB, and Socket.IO.

## 🌐 Live Demo
> Coming soon after deployment

## ✨ Features

- 🔐 User authentication (Register & Login with JWT)
- 💬 Real-time one-to-one messaging using Socket.IO
- 🟢 Online / Offline user status
- ⌨️ Typing indicator
- 🤖 AI Smart Reply suggestions (powered by Groq AI)
- 📋 Chat summarization
- 🔔 Task & reminder detection from messages
- 📱 Clean and responsive UI

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcryptjs
- Groq AI API

## 📁 Folder Structure

ai-chat-app/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route logic
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── services/      # AI service (Groq)
│   ├── socket/        # Socket.IO events
│   └── server.js      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/       # Axios instance
│   │   ├── components/# React components
│   │   ├── context/   # Auth context
│   │   ├── pages/     # Login, Register, Chat
│   │   └── socket/    # Socket.IO client
│   └── index.html

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Groq API key (free at https://console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/sreeayshwarya07/ai-chat-app.git
cd ai-chat-app
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aichat
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` in your browser.

## 🤖 AI Features

| Feature | Description |
|---------|-------------|
| Smart Replies | Click ✨ AI button to get 3 reply suggestions |
| Summarize | Click 📋 Summarize to get a summary of the conversation |
| Task Detection | Automatically detects reminders like "meeting at 5pm" |

## 👤 Author
- GitHub: [@sreeayshwarya07](https://github.com/sreeayshwarya07)
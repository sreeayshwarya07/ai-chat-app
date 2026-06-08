// socket/socket.js
// Creates a single Socket.IO client instance
// Imported wherever real-time features are needed

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false, // we manually connect after login
});

export default socket;
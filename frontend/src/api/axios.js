// api/axios.js
// Creates a single Axios instance used across the entire app
// Automatically attaches the JWT token to every request

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api
});

// Before every request, attach the token from localStorage if it exists
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
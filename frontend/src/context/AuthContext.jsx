// context/AuthContext.jsx
// Provides global auth state to the entire app
// Any component can access: user, login, logout

import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Provider wraps the whole app and shares auth state
export const AuthProvider = ({ children }) => {
  // Check if user is already logged in (stored in localStorage)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Called after successful login or register
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // save to localStorage
    setUser(userData);
  };

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — makes it easy to use auth in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
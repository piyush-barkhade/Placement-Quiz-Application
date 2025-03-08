import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null); // Added email state

  useEffect(() => {
    if (authToken && userId && email) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", email); // Storing email in localStorage
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("email"); // Removing email from localStorage
    }
  }, [authToken, userId, email]);

  useEffect(() => {
    if (authToken && userId && email) {
      console.log("User is logged in:", userId, email);
    } else {
      console.log("User is not logged in.");
    }
  }, [authToken, userId, email]);

  const login = (token, id, userEmail) => {
    setAuthToken(token);
    setUserId(id);
    setEmail(userEmail); // Setting email on login
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    setEmail(null); // Removing email on logout
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

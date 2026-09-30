import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hireready_user");
    const token = localStorage.getItem("hireready_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hireready_token", data.token);
    localStorage.setItem("hireready_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    // Intentionally does NOT log the user in or store a token here —
    // after registering, the user is sent to /login to sign in manually.
    const { data } = await api.post("/auth/register", formData);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("hireready_token");
    localStorage.removeItem("hireready_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
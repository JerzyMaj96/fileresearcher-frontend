import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getAuthToken, setAuthToken } from "../api/api_helper";
import { authService } from "../api/services";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (e) {
          console.error("Auth check failed", e);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const token = await authService.login(username, password);
    setAuthToken(token);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents flickering/redirect issues

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    // Check if user exists and isn't the literal string "undefined"
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("AuthContext Error: Invalid JSON in localStorage", error);
        localStorage.removeItem('user'); // Clear the corrupt data
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* Only render children once we know the auth status */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access_token') ? true : false
  );

  const loginUser = (tokens) => {
    setAuthTokens(tokens);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
  };

  const logoutUser = () => {
    setAuthTokens(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

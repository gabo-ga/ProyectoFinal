import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => ({
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  }));
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!authTokens.access
  );

  useEffect(() => {
    if (authTokens.access) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authTokens.access}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authTokens]);

  const loginUser = (tokens) => {
    setAuthTokens(tokens);
    setIsAuthenticated(true);
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/token/refresh", {
        refresh: authTokens.refresh,
      });
      const newAccessToken = response.data.access;
      setAuthTokens((prevTokens) => ({
        ...prevTokens,
        access: newAccessToken,
      }));
      localStorage.setItem("access_token", newAccessToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
    } catch (error) {
      console.log("Error al refrescar el token", error);
      logoutUser();
    }
  };

  useEffect(() => {
    if (authTokens.access) {
      const tokenExpirationTime = jwt_decode(authTokens.access).exp * 1000;
      const now = Date.now();
      const timeUntilExpiration = tokenExpirationTime - now;

      if (timeUntilExpiration <= 0) {
        refreshToken();
      } else {
        const timeout = setTimeout(refreshToken, timeUntilExpiration - 5000);
        return () => clearTimeout(timeout);
      }
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        isAuthenticated,
        loginUser,
        logoutUser,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  }
  return context;
};

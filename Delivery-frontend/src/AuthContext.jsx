import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => ({
    access_token: localStorage.getItem("access_token"),
    refresh_token: localStorage.getItem("refresh_token"),
  }));
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!authTokens.access_token
  );
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (authTokens.access_token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authTokens.access_token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authTokens]);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        usuario: username,
        password,
      });
      console.log("Respuesta:", response.data);
      const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
      setAuthTokens(tokens);
      setIsAuthenticated(true);
      setUserId(response.data.user_id);
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      localStorage.setItem("user_id", response.data.user_id);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokens.access_token}`;
    } catch (error) {
      throw new Error("Error al iniciar Sesion: " + error.response.data.detail);
    }
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
      const response = await axios.post(
        "http://localhost:8000/token/refresh/",
        {
          refresh: authTokens.refresh_token,
        }
      );
      const newAccessToken = response.data.access_token;
      setAuthTokens((prevTokens) => ({
        ...prevTokens,
        access_token: newAccessToken,
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
    if (authTokens.access_token) {
      const tokenExpirationTime =
        jwt_decode(authTokens.access_token).exp * 1000;
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

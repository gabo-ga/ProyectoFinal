// src/axiosInstance.js

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'http://localhost:8000';

let tokens = {
  access: localStorage.getItem('access_token'),
  refresh: localStorage.getItem('refresh_token'),
};

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: tokens.access ? 'Bearer ' + tokens.access : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (request) => {
  if (tokens.access) {
    const user = jwt_decode(tokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return request;

    try {
      const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: tokens.refresh,
      });
      tokens.access = response.data.access;
      localStorage.setItem('access_token', tokens.access);
      request.headers.Authorization = 'Bearer ' + tokens.access;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      // Opcional: Redirige al login si el token de refresco también ha expirado
    }
  }
  return request;
});

export default axiosInstance;

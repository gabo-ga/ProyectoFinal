// src/axiosInstance.js

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
//import https from 'https';


const baseURL = 'http://localhost:8000';

let tokens = {
  access: localStorage.getItem('access_token'),
  refresh: localStorage.getItem('refresh_token'),
};

/*const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});*/

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  //withCredentials: true,
  headers: {
    Authorization: tokens.access ? 'Bearer ' + tokens.access : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Interceptor para refrescar el token si ha expirado
axiosInstance.interceptors.request.use(async (request) => {
  if (tokens.access) {
    const user = jwt_decode(tokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return request;

    try {
      // Realizar la solicitud de refresco de token a '/token/refresh/'
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: tokens.refresh,
      });
      tokens.access = response.data.access;
      localStorage.setItem('access_token', tokens.access);
      request.headers.Authorization = 'Bearer ' + tokens.access;
    } catch (error) {
      console.error('Error al refrescar el token:', error);

    }
  }
  return request;
});

// Interceptor para manejar respuestas no autorizadas (opcional)
/*axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      // Opcional: Redirigir al usuario al inicio de sesión
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/
export default axiosInstance;

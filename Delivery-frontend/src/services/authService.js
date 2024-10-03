import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const login = (username, password) => {
  return axios.post(API_URL + 'token/', {
    username,
    password,
  });
};

export const register = (username, email, password) => {
  return axios.post(API_URL + 'registro/', {
    username,
    email,
    password,
  });
};

export const refreshToken = (refresh) => {
  return axios.post(API_URL + 'token/refresh/', {
    refresh,
  });
};

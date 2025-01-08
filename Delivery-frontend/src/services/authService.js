import axios from 'axios';

const API_URL = 'http://localhost:8000/';

import axiosInstance from '../axiosInstance';

export const loginUser = async (usuario, password) => {
  try {
    const response = await axiosInstance.post('/login/', {
      usuario,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
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

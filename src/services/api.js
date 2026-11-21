import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.escuelajs.co/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erreur lecture token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('jwt_token');
      console.warn('Session expirée ou non autorisée.');
    }
    return Promise.reject(error);
  }
);

export default api;

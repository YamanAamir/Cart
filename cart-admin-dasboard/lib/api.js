import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.clubpromfg.com/api',
  // baseURL: 'https://api.clubpromfg.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('DEVICE');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
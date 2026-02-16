import axios from 'axios';
import { baseUrl } from './const';

const api = axios.create({
  baseURL: `${baseUrl}/api`,
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

const formDataApi = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

formDataApi.interceptors.request.use((config) => {
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

formDataApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { api, formDataApi };
export default api;
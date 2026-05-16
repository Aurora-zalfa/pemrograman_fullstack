import axios from 'axios';
import { getToken } from './auth';

const service = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan port backend kamu
  timeout: 5000
});

service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default service;
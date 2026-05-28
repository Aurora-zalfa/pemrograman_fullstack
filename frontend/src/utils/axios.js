
import axios from 'axios';
import { getToken } from './auth';

const service = axios.create({
  // UBAH DARI 5000 MENJADI 3000 AGAR COCOK DENGAN BACKEND KAMU
  baseURL: 'http://localhost:3000', 
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
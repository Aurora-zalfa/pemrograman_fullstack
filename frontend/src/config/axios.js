// src/config/axios.js
import axios from 'axios';

// Base URL API Backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    // Jika ada token, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Jika upload file (multipart/form-data), biarkan axios set otomatis
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Handle error response
    if (error.response) {
      console.error('❌ Response Error:', error.response.status, error.response.data);
      
      // Jika 401 Unauthorized, redirect ke login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('❌ No Response:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

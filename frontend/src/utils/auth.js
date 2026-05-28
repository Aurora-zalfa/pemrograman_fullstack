// frontend/src/utils/auth.js
import Cookies from 'js-cookie';

const LocalStorageKey = 'token';           // Key yang dipakai Login.jsx
const CookieKey = 'Admin-Token-Sawit';     // Key lama (backward compatible)

export function getToken() {
  // 1. Cek localStorage dulu (cara login sekarang nyimpen token)
  let token = localStorage.getItem(LocalStorageKey);
  
  // 2. Kalau nggak ada, cek cookie (untuk kompatibilitas kode lama)
  if (!token) {
    token = Cookies.get(CookieKey);
  }
  
  return token;
}

export function setToken(token) {
  // Simpan di KEDUA tempat biar aman
  localStorage.setItem(LocalStorageKey, token);
  Cookies.set(CookieKey, token, { expires: 1 });
}

export function removeToken() {
  localStorage.removeItem(LocalStorageKey);
  Cookies.remove(CookieKey);
}
import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token-Sawit';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 }); // Token hilang dalam 1 hari
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
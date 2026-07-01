// Konfigurasi endpoint untuk Data Master
const API_BASE_URL = 'http://localhost:5000/api/master';

export const API_ENDPOINTS = {
  KEBUN: `${API_BASE_URL}/kebun`,
  PABRIK: `${API_BASE_URL}/pabrik`,
  SUPIR: `${API_BASE_URL}/supir`,
  TRUK: `${API_BASE_URL}/truk`,
  USERS: `${API_BASE_URL}/users`
};

export default API_ENDPOINTS;
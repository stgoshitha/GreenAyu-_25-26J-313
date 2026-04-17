import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401s (Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Potentially handle auto-logout here if token is invalid
      localStorage.removeItem('ap_token');
      localStorage.removeItem('ap_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

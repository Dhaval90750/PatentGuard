import axios from 'axios';

/**
 * @desc    Standardized Production-Ready API Instance
 * @purpose Centralizes all network requests for VantagePoint, enabling environment-based configuration.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Global Auth Injection
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem('vantagepoint-auth'));
  if (authData?.state?.token) {
    config.headers.Authorization = `Bearer ${authData.state.token}`;
  }
  return config;
});

export default api;

import axios from 'axios';
const API = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api` });
// Add interceptor to attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
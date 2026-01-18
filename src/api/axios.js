import axios from "axios";

const api = axios.create({
  baseURL: "https://project-ecommerce-laravel-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Or your deployed URL
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

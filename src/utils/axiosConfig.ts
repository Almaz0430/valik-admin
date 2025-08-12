import axios from 'axios';

const baseUrl = import.meta.env.VITE_NODE_ENV === 'development'
? 'http://localhost:8080'
: 'https://api.valik.kz';

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

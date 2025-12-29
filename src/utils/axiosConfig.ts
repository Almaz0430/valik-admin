import axios from 'axios';
import env from '../config/env';

const baseUrl = env.API_URL;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// core/api/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.31.68:3000',
  timeout: 10000,
});

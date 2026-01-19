// core/api/interceptors.ts
import { api } from './axios';
import { useAuthStore } from '../../auth/store'; 

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

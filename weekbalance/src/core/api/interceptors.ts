// core/api/interceptors.ts
import { api } from './axios';
import { useAuthStore } from '../../auth/store'; 

api.interceptors.request.use((config) => {
  const { session } = useAuthStore();
  console.log('Interceptor - Token:', session?.access_token!);
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

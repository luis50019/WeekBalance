import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/ApiConfig";

const SESSION_KEY = "@weekbalance_session";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(SESSION_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Silent fail for token retrieval
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si es un error 401 (unauthorized)
    if (error.response?.status === 401) {
      try {
        // Verificar si ya hay un token guardado en storage
        const existingToken = await AsyncStorage.getItem(SESSION_KEY);

        // Si ya hay un token, podría ser que expiró, así que limpiamos
        // Si no hay token, probablemente sea un error de login (credenciales inválidas)
        if (existingToken) {
          await AsyncStorage.removeItem(SESSION_KEY);
        }
      } catch (clearError) {
        // Silent fail for 401 handling
      }
    }

    return Promise.reject(error);
  },
);

export { apiClient };

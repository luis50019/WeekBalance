// core/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.100.46:3000",
  timeout: 10000,
});

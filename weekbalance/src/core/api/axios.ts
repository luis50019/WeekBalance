// core/api/axios.ts
import axios from "axios";

export const api = axios.create({
  //baseURL: "https://weekbalance.onrender.com",
  baseURL: "http://192.168.100.46:3000",
  timeout: 10000,
});

import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";

export const generateUUID = (): string => {
  return Crypto.randomUUID();
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const verifyPassword = (password: string, hash: string): boolean => {
  const inputHash = CryptoJS.SHA256(password).toString();
  return inputHash === hash;
};

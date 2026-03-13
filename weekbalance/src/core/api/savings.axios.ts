import { api } from "./axios";

export const getSavingHistory = async (id: string, token: string) => {
  return api.get(`/saving/history/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import { api } from "./axios";

export const getSavingHistory = async (id: string, token: string) => {
  return api.get(`/saving/history/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createSaving = async (data: { account_id: string; amount: number; description: string }, token: string) => {
  return api.post("/saving/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createWeeklyGoal = async (data: {
  account_id: string;
  target_amount: number;
  week_start: string;
  week_end: string;
}, token: string) => {
  return api.post("/saving/weekly-goal", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerSaving = async (data: {
  account_id: string;
  amount: number;
  week_start: string;
  week_end: string;
}, token: string) => {
  return api.post("/saving/register", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getWeeklyGoals = async (accountId: string, token: string) => {
  return api.get("/saving/weekly-goals", {
    params: { accountId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

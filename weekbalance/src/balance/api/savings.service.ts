import { getSavingHistory, createSaving, createWeeklyGoal, registerSaving, getWeeklyGoals } from "../../core/api/savings.axios";

export const getSavingHistoryService = async (id: string, token: string) => {
  try {
    const { data } = await getSavingHistory(id, token);
    if (!data) throw new Error("Error al obtener el historial de ahorros");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

export const createSavingService = async (
  accountId: string,
  amount: number,
  description: string,
  token: string
) => {
  try {
    const { data } = await createSaving(
      { account_id: accountId, amount, description },
      token
    );
    if (!data) throw new Error("Error al crear el ahorro");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

export const createWeeklyGoalService = async (
  accountId: string,
  targetAmount: number,
  weekStart: string,
  weekEnd: string,
  token: string
) => {
  try {
    const { data } = await createWeeklyGoal(
      {
        account_id: accountId,
        target_amount: targetAmount,
        week_start: weekStart,
        week_end: weekEnd,
      },
      token
    );
    if (!data) throw new Error("Error al crear la meta semanal");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

export const registerSavingService = async (
  accountId: string,
  amount: number,
  weekStart: string,
  weekEnd: string,
  token: string
) => {
  try {
    const { data } = await registerSaving(
      {
        account_id: accountId,
        amount,
        week_start: weekStart,
        week_end: weekEnd,
      },
      token
    );
    if (!data) throw new Error("Error al registrar el ahorro");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

export const getWeeklyGoalsService = async (accountId: string, token: string) => {
  try {
    const { data } = await getWeeklyGoals(accountId, token);
    if (!data) throw new Error("Error al obtener las metas semanales");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

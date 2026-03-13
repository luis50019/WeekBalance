import { getSavingHistory } from "../../core/api/savings.axios";

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

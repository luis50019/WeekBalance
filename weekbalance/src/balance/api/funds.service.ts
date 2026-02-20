import { getHistoryFunds, registerFunds } from "../../core/api/funds.axios";
import { CreateFunds } from "../types/Request/CreateFunds";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

export const register = async (newExpense: CreateFunds, token: string) => {
  try {
    const { data } = await registerFunds(newExpense, token);
    if (!data) throw new Error("Error al registrar el perfil");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error del servidor");
  }
};

export const getHistory = async (
  id: string,
  token: string,
): Promise<ResponseIncomeDto[]> => {
  try {
    const { data } = await getHistoryFunds(id, token);
    if (!data) throw new Error("Error al obtener la informacion del perfil");
    return data.data;
  } catch (error) {
    throw new Error("Error del servidor");
  }
};

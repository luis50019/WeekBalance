import { getHistoryExpenses, registerExpenses } from "../../core/api/expenses.axios";
import { CreateExpense } from "../types/Request/CreateExpense";



export const register = async (newExpense: CreateExpense,token:string) => {
  try {
    console.log('informacion: '+newExpense);
    console.log('toen: '+token);
    const { data } = await registerExpenses(newExpense,token);
    if (!data) throw new Error('Error al registrar el perfil');
    return data
  } catch (error) {
    throw new Error('Error del servidor');
  }
}

export const getHistory = async (id: string,token:string) => {
  try {
    const { data } = await getHistoryExpenses(id,token);
    if (!data) throw new Error('Error al obtener la informacion del perfil');
    return data.data
  } catch (error) {
    throw new Error('Error del servidor');
  }
}

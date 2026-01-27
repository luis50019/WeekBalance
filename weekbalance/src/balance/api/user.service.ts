import { getinfoUser } from "../../core/api/user.axios";

export const getFinancialSummary = async (id:string,token:string) => {
  try {
    const { data } = await getinfoUser(id,token);
    if (!data) throw new Error('Error al obtener la informacion del usuario');
    return data
  } catch (error) {
    console.log(error);
    throw new Error('Error del servidor');
  }
}
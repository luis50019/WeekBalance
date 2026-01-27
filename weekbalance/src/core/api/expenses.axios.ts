import { CreateExpense } from "../../balance/types/Request/CreateExpense";
import { api } from "./axios";
interface IRegisterProfile {
  id: string;
  full_name: string;
  avatar_url: string;
}
// headers.Authorization = `Bearer ${session.access_token}`;
export const registerExpenses = async (data: CreateExpense, token: string) => {
  return api.post(
    '/expenses/register/',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getHistoryExpenses = async (id:string,token:string) => {
  return api.get('/expenses/history/'+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

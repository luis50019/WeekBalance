import { CreateFunds } from "../../balance/types/Request/CreateFunds";
import { api } from "./axios";
interface IRegisterProfile {
  id: string;
  full_name: string;
  avatar_url: string;
}
// headers.Authorization = `Bearer ${session.access_token}`;
export const registerFunds = async (data: CreateFunds, token: string) => {
  return api.post(
    '/incomes/add/',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getHistoryFunds = async (id:string,token:string) => {
  return api.get('/incomes/history/'+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

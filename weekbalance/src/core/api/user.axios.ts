import { api } from "./axios";

export const getinfoUser = async (id:string,token:string) => {
  return api.get('/auth/info/'+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

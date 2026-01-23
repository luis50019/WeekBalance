import { api } from "./axios";
interface IRegisterProfile {
  id: string;
  full_name: string;
  avatar_url: string;
}
// headers.Authorization = `Bearer ${session.access_token}`;
export const registerProfile = async (data: IRegisterProfile, token: string) => {
  console.log('Enviando:', data);

  return api.post(
    '/auth/register/',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getInfoProfile = async (id:string,token:string) => {
  return api.get('/auth/profile/'+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

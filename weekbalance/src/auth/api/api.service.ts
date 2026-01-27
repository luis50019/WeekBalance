import { getInfoProfile, registerProfile } from "../../core/api/api.axios"
import { Profile } from "../types/Profile";

export const register = async (infoProfile: Profile,token:string) => {
  try {
    const response = await registerProfile(infoProfile,token);
    if (!response) throw new Error('Error al registrar el perfil');
    return response.data.data;
  } catch (error) {
    console.log(error)
    throw new Error('Error del servidor');
  }
}

export const getProfile = async (id: string,token:string) => {
  try {
    const { data } = await getInfoProfile(id,token);
    if (!data) throw new Error('Error al obtener la informacion del perfil');
    return data.data
  } catch (error) {
    console.log(error)
    throw new Error('Error del servidor');
  }
}

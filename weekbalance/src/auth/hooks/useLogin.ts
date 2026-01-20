import { useForm } from "react-hook-form";
import { LoginForm } from "../types/Form";
import { loginWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { Alert } from "react-native";
import { use, useEffect } from "react";

export const useLogin =(navigation)=>{
  const {control,formState,handleSubmit} = useForm<LoginForm>({});
  const { setSession,user } = useAuthStore();

  const onSubmit = async (data:LoginForm)=>{
    try {
      const response = await loginWithEmail(data.email,data.password);
      console.log(response);
      setSession(response.session);
      
    } catch (error) {
      console.log(error);
      Alert.alert("Error","Error al iniciar sesion");
    }
  }

  useEffect(()=>{
    //TODO: enviar el id del usuario para poder obtener su informacion de la base de datos
    if(!user) return;
    navigation.reset({
        index:0,
        routes:[
          {
            name:"Home",
          }
        ]
      })
  },[user])

  return {control,formState,handleSubmit,onSubmit,}
}
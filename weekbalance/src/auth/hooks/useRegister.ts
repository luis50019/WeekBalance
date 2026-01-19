import { useForm } from "react-hook-form";
import { LoginForm, RegisterForm } from "../types/Form";
import { registerWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { Alert } from "react-native";

export const useRegister =(navigation)=>{
  const {control,formState,handleSubmit} = useForm<RegisterForm>({});
  const { setSession,user } = useAuthStore();

  const onSubmit = async (data:LoginForm)=>{
    try {
      const response = await registerWithEmail(data.email,data.password);
      console.log(response);
      setSession(response.session);
    } catch (error) {
      console.log(error);
      Alert.alert("Error","Error al iniciar sesion");
    }
  }


  return {control,formState,handleSubmit,onSubmit,}
}
import { useForm } from "react-hook-form";
import { LoginForm } from "../types/Form";
import { loginWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { Alert } from "react-native";
import { getProfile } from "../api/api.service";

export const useLogin = () => {
  const { control, formState, handleSubmit } = useForm<LoginForm>({});
  const { setSession, setProfile } = useAuthStore();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginWithEmail(data.email, data.password);
      const res  = await getProfile(response.user?.id!,response.session?.access_token!);
      console.log(res);
      setProfile({avatar_url: res.avatar_url, full_name: res.full_name, id: res.id,account_id:res.account_id});
      setSession(response.session, response.user);
    } catch (error) {
      Alert.alert("Error", "Error al iniciar sesion");
    }
  }

  return { control, formState, handleSubmit, onSubmit, }
}
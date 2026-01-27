import { set, useForm } from "react-hook-form";
import { RegisterForm } from "../types/Form";
import { registerWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { Alert } from "react-native";
import { URL } from "../../core/constants/Url";
import { register } from "../api/api.service";

export const useRegister = () => {
  const { control, formState, handleSubmit } = useForm<RegisterForm>();
  const {
    setSession,
    setProfile,
  } = useAuthStore();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await registerWithEmail(
        data.email,
        data.password
      );
      const resApi = await register(
          {avatar_url:URL.url_avatar, 
            full_name: data.name!,
            id:response.user?.id!},response.session?.access_token!);
      setProfile({avatar_url: URL.url_avatar, full_name: data.name, id: response.user?.id!, account_id:resApi.account_id });
      setSession(response.session!, response.user!);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al registrarse");
    }
  };
  return {
    control,
    formState,
    handleSubmit,
    onSubmit
  };
};

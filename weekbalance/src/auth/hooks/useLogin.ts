import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "../types/Form";
import { loginWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { getProfile } from "../api/api.service";

const mapBackendError = (error: unknown): string => {
  const errorMessage =
    error instanceof Error ? error.message.toLowerCase() : "";

  if (
    errorMessage.includes("invalid login") ||
    errorMessage.includes("invalid credentials") ||
    errorMessage.includes("invalid email") ||
    errorMessage.includes("wrong password") ||
    errorMessage.includes("email or password")
  ) {
    return "Correo o contraseña incorrectos.";
  }

  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("connection")
  ) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  if (
    errorMessage.includes("user not found") ||
    errorMessage.includes("no user")
  ) {
    return "El usuario no existe.";
  }

  return "Ocurrió un error al intentar iniciar sesión. Intenta nuevamente más tarde.";
};

export const useLogin = () => {
  const { control, formState, handleSubmit } = useForm<LoginForm>({});
  const { setSession, setProfile } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const clearError = () => {
    setErrorMessage("");
  };

  const onSubmit = async (data: LoginForm) => {
    clearError();

    if (!data.email || !data.password) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await loginWithEmail(data.email, data.password);
      const res = await getProfile(
        response.user?.id!,
        response.session?.access_token!,
      );
      setProfile({
        avatar_url: res.avatar_url,
        full_name: res.full_name,
        id: res.id,
        account_id: res.account_id,
      });
      setSession(response.session, response.user);
    } catch (error: unknown) {
      const mappedError = mapBackendError(error);
      setErrorMessage(mappedError);
    }
  };

  return {
    control,
    formState,
    handleSubmit,
    onSubmit,
    errorMessage,
  };
};


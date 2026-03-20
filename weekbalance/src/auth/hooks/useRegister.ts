import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { RegisterForm } from "../types/Form";
import { registerWithEmail } from "../api/auth.service";
import { useAuthStore } from "../store";
import { URL } from "../../core/constants/Url";
import { register } from "../api/api.service";

const mapBackendError = (error: unknown): string => {
  const errorMessage =
    error instanceof Error ? error.message.toLowerCase() : "";

  if (
    errorMessage.includes("user already registered") ||
    errorMessage.includes("already exists") ||
    errorMessage.includes("already been registered") ||
    errorMessage.includes("email already")
  ) {
    return "Este correo ya se encuentra registrado.";
  }

  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("connection")
  ) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  if (
    errorMessage.includes("weak password") ||
    errorMessage.includes("password too short")
  ) {
    return "La contraseña es muy débil. Usa al menos 6 caracteres.";
  }

  return "Ocurrió un error al intentar crear la cuenta. Intenta nuevamente más tarde.";
};

export const useRegister = () => {
  const { control, formState, handleSubmit } = useForm<RegisterForm>();
  const { setSession, setProfile } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const clearError = () => {
    setErrorMessage("");
  };

  const onSubmit = async (data: RegisterForm) => {
    clearError();

    if (!data.name || !data.email || !data.password) {
      setErrorMessage("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await registerWithEmail(data.email, data.password);
      const resApi = await register(
        {
          avatar_url: URL.url_avatar,
          full_name: data.name!,
          id: response.user?.id!,
        },
        response.session?.access_token!,
      );
      setProfile({
        avatar_url: URL.url_avatar,
        full_name: data.name,
        id: response.user?.id!,
        account_id: resApi.account_id,
      });
      setSession(response.session!, response.user!);
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

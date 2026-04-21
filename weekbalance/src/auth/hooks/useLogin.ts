import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "../types/Form";
import { useAuthStore } from "../store";

const mapError = (error: unknown): string => {
  const errorMessage =
    error instanceof Error ? error.message.toLowerCase() : "";

  if (
    errorMessage.includes("inválidas") ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("incorrect")
  ) {
    return "Correo o contraseña incorrectos.";
  }

  return "Ocurrió un error al intentar iniciar sesión. Intenta nuevamente más tarde.";
};

export const useLogin = () => {
  const { control, formState, handleSubmit } = useForm<LoginForm>({
    mode: "onChange",
  });
  const { login } = useAuthStore();
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
      await login(data.email, data.password);
    } catch (error: unknown) {
      const mappedError = mapError(error);
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

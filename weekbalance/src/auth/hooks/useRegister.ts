import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterForm } from "../types/Form";
import { useAuthStore } from "../store";

const mapError = (error: unknown): string => {
  const errorMessage =
    error instanceof Error ? error.message.toLowerCase() : "";

  if (
    errorMessage.includes("ya está registrado") ||
    errorMessage.includes("already") ||
    errorMessage.includes("exists")
  ) {
    return "Este correo ya se encuentra registrado.";
  }

  if (
    errorMessage.includes("weak") ||
    errorMessage.includes("short") ||
    errorMessage.includes("mínimo")
  ) {
    return "La contraseña es muy débil. Usa al menos 6 caracteres.";
  }

  return "Ocurrió un error al intentar crear la cuenta. Intenta nuevamente más tarde.";
};

export const useRegister = () => {
  const { control, formState, handleSubmit } = useForm<RegisterForm>({
    mode: "onChange",
  });
  const { register } = useAuthStore();
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
      await register(data.email, data.password, data.name);
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

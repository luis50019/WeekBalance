import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterForm } from "../types/Form";
import { useAuthStore } from "../store";

const isServerError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("econnrefused") ||
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("socket") ||
      message.includes("enotfound") ||
      message.includes("500") ||
      message.includes("502") ||
      message.includes("503") ||
      message.includes("504") ||
      message.includes("fetch")
    );
  }
  return false;
};

const mapError = (error: unknown): string => {
  // Check for server unavailability errors
  if (isServerError(error)) {
    return "El servidor se está iniciando. Intenta nuevamente en un minuto.";
  }

  // Handle Axios errors with server response
  if (error instanceof Error && "response" in error) {
    const axiosError = error as unknown as { response?: { data?: { message?: string } } };
    const serverMessage = axiosError.response?.data?.message;
    
    if (serverMessage) {
      const lowerMessage = serverMessage.toLowerCase();
      if (
        lowerMessage.includes("ya está registrado") ||
        lowerMessage.includes("correo") ||
        lowerMessage.includes("registered")
      ) {
        return "Este correo ya se encuentra registrado.";
      }
      if (
        lowerMessage.includes("weak") ||
        lowerMessage.includes("short") ||
        lowerMessage.includes("mínimo")
      ) {
        return "La contraseña es muy débil. Usa al menos 6 caracteres.";
      }
      return serverMessage;
    }
  }

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";

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

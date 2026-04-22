import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "../types/Form";
import { useAuthStore } from "../store";

const isServerError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Network errors, connection refused, timeout, server unavailable
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
   
  // Si es un error de Axios con respuesta del servidor
  if (error instanceof Error && "response" in error) {
    const axiosError = error as unknown as { response?: { data?: { message?: string } } };
    const serverMessage = axiosError.response?.data?.message;
    
    if (serverMessage) {
      const lowerMessage = serverMessage.toLowerCase();
      if (
        lowerMessage.includes("inválidas") ||
        lowerMessage.includes("el correo o la contraseña son incorrectos") ||
        lowerMessage.includes("incorrect") ||
        lowerMessage.includes("invalid") ||
        lowerMessage.includes("invalid_grant")
      ) {
        return "El correo o la contraseña son incorrectos.";
      }
      return serverMessage;
    }
  }
  
  // Fallback para errores sin respuesta del servidor
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";
  if (
    errorMessage.includes("inválidas") ||
    errorMessage.includes("el correo o la contraseña son incorrectos") ||
    errorMessage.includes("incorrect") ||
    errorMessage.includes("invalid") ||
    errorMessage.includes("invalid_grant") ||
    errorMessage.includes("auth")
  ) {
    return "El correo o la contraseña son incorrectos.";
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
      setErrorMessage(mapError(error));
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

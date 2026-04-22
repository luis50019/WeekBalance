import { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/store";
import { updateProfile as updateProfileApi } from "../../core/api/profile.service";

// Validación del nombre completo
const validateFullName = (fullName: string): { isValid: boolean; error?: string } => {
  const trimmed = fullName.trim();

  // No puede estar vacío
  if (!trimmed) {
    return { isValid: false, error: "El nombre no puede estar vacío" };
  }

  // No puede comenzar con número
  if (/^\d/.test(trimmed)) {
    return { isValid: false, error: "El nombre no puede comenzar con un número" };
  }

  // No puede comenzar con espacio (ya hace trim pero doble check)
  if (/^\s/.test(fullName)) {
    return { isValid: false, error: "El nombre no puede comenzar con un espacio" };
  }

  // No puede terminar con espacio
  if (/\s$/.test(fullName)) {
    return { isValid: false, error: "El nombre no puede terminar con un espacio" };
  }

  // Solo permite letras (con acentos), números (no al inicio) y espacios
  if (!/^[A-Za-zÀ-ÿ]([A-Za-zÀ-ÿ0-9\s]*[A-Za-zÀ-ÿ0-9])?$/.test(trimmed)) {
    return { isValid: false, error: "El nombre contiene caracteres no permitidos" };
  }

  // Debe contener al menos una letra
  if (!/[A-Za-zÀ-ÿ]/.test(trimmed)) {
    return { isValid: false, error: "El nombre debe contener al menos una letra" };
  }

  return { isValid: true };
};

export const useProfile = () => {
  const { user, profile, refreshAccount } = useAuthStore();
  const [name, setNameState] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    if (profile) {
      setNameState(profile.full_name);
    }
    if (user) {
      setEmail(user.email);
    }
  };

  // Validación onChange del nombre
  const setName = (fullName: string) => {
    setNameState(fullName);
    
    const validation = validateFullName(fullName);
    if (validation.isValid) {
      setNameError("");
      setErrorMessage("");
    } else {
      setNameError(validation.error || "Error de validación");
    }
  };

  const updateName = async () => {
    const validation = validateFullName(name);
    
    if (!validation.isValid) {
      setErrorMessage(validation.error || "El nombre no es válido");
      setSuccessMessage("");
      return;
    }

    if (name === profile?.full_name) {
      setErrorMessage("El nombre no ha cambiado");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!user?.id) {
        throw new Error("No se encontró el ID de usuario");
      }

      await updateProfileApi({
        userId: user.id,
        fullName: name.trim(),
      });

      setSuccessMessage("Nombre actualizado correctamente");
      setNameError("");
      
      // Refrescar el perfil en el store
      await refreshAccount();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Error al actualizar el nombre";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    isSubmitting,
    errorMessage,
    nameError,
    successMessage,
    updateName,
    isNameValid: !nameError && name.trim().length > 0,
  };
};
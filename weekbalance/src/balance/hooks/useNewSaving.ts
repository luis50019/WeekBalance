import { useState, useContext } from "react";
import { useAuthStore } from "../../auth/store";
import { registerSavingService } from "../api/savings.service";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { BalanceContext } from "../../core/context/BalanceProvider";

export const useNewSaving = () => {
  const { navigationTo } = useNavigate();
  const { account } = useAuthStore();
  const { setChangeValue } = useContext(BalanceContext);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const onSubmit = async (data: { amount: number; description: string }) => {
    if (!account) {
      showError("No hay sesión activa");
      return;
    }

    if (data.amount <= 0) {
      showError("El monto debe ser mayor a 0");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerSavingService(data.amount, data.description);
      setChangeValue();
      navigationTo("Saving");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al registrar el ahorro";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentWeekDates = () => {
    return getWeekDates();
  };

  return {
    onSubmit,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
    getCurrentWeekDates,
  };
};

export function getWeekDates(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToSunday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart: weekStart.toISOString().split("T")[0],
    weekEnd: weekEnd.toISOString().split("T")[0],
  };
}

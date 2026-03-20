import { useState } from "react";
import { useAuthStore } from "../../auth/store";
import { createWeeklyGoalService, registerSavingService } from "../api/savings.service";
import { useNavigate } from "../../shared/hooks/useNavigate";

export const useNewSaving = () => {
  const { navigationTo } = useNavigate();
  const { session, profile } = useAuthStore();
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
    if (!session?.access_token) {
      showError("No hay sesión activa");
      return;
    }

    if (data.amount <= 0) {
      showError("El monto debe ser mayor a 0");
      return;
    }

    const weekDates = getWeekDates();

    try {
      setIsSubmitting(true);

      try {
        await createWeeklyGoalService(
          profile?.account_id!,
          data.amount,
          weekDates.weekStart,
          weekDates.weekEnd,
          session?.access_token
        );
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err?.response?.data?.message?.includes("ya existe")) {
          await registerSavingService(
            profile?.account_id!,
            data.amount,
            weekDates.weekStart,
            weekDates.weekEnd,
            session?.access_token
          );
        } else {
          throw error;
        }
      }

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

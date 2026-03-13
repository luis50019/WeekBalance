import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../auth/store";
import { getHistory, register } from "../api/funds.service";
import { CreateFunds } from "../types/Request/CreateFunds";
import { BalanceContext } from "../../core/context/ContextBalance";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

type Expense = {
  amount: number;
  description: string;
};

export const useFunds = () => {
  const { setChangeValue } = useContext(BalanceContext);
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { session, profile } = useAuthStore();
  const [category, setCategory] = useState<string>("");
  const [history, setHistory] = useState<ResponseIncomeDto[]>([]);
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlerFilter = (cate: string) => {
    if (cate == "All") {
      setDataFilter(history);
      return;
    }
    const filter = history.filter(({ category }) => category == cate);
    setDataFilter(filter);
  };

  const getHistoryFunds = async () => {
    try {
      if (!profile?.account_id || !session?.access_token)
        throw new Error("No has iniciado sesion");
      const response = await getHistory(
        profile?.account_id,
        session?.access_token,
      );
      setDataFilter(response);
      setHistory(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoryFunds();
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const onSubmit = async (data: Expense) => {
    if (!category) {
      showError("Debes seleccionar una categoría");
      return;
    }

    if (!data.description || data.description.trim() === "") {
      showError("Debes escribir una descripción");
      return;
    }

    try {
      setIsSubmitting(true);
      const newExpense: CreateFunds = {
        account_id: profile?.account_id!,
        category: category,
        source: data.amount,
        description: data.description,
        amount: data.amount.toString(),
      };
      if (!session?.access_token) {
        showError("No hay sesión activa");
        return;
      }
      await register(newExpense, session?.access_token);
      setChangeValue();
      navigationTo("historyIncomes");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al registrar el ingreso";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  return {
    control,
    formState,
    handleSubmit,
    onSubmit,
    handleCategoryChange,
    category,
    dataFilter,
    getHistoryFunds,
    handlerFilter,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
  };
};

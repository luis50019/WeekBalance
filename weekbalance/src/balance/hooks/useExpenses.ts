import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CreateExpense } from "../types/Request/CreateExpense";
import { useAuthStore } from "../../auth/store";
import { getHistory, register as registerExpense } from "../api/expenses.service";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";
import { BalanceContext } from "../../core/context/BalanceProvider";

type Expense = {
  amount: number;
  description: string;
};

export const useExpenses = () => {
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { account, refreshAccount } = useAuthStore();
  const { setChangeValue } = useContext(BalanceContext);
  const [category, setCategory] = useState<string>("");
  const [historyExpenses, setHistoryExpenses] = useState<ResponseIncomeDto[]>([]);
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingExpense, setPendingExpense] = useState<Expense | null>(null);
  const [showGoalWarning, setShowGoalWarning] = useState(false);
  const [goalWarningData, setGoalWarningData] = useState<{
    remainingToGoal: number;
    expenseAmount: number;
  } | null>(null);

  const handlerFilter = (cate: string) => {
    if (cate == "All") {
      setDataFilter(historyExpenses);
      return;
    }
    const filter = historyExpenses.filter(({ category }) => category == cate);
    setDataFilter(filter);
  };

  const getHistoryExpenses = async () => {
    try {
      if (!account) return;
      const response = await getHistory(account.id);
      const mapped = response.map(exp => ({
        id: exp.id,
        account_id: exp.account_id,
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        created_at: exp.created_at,
      }));
      setDataFilter(mapped);
      setHistoryExpenses(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoryExpenses();
  }, [account]);

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
      const newExpense: CreateExpense = {
        account_id: account?.id!,
        amount: data.amount,
        description: data.description,
        category: category,
      };
      await registerExpense(newExpense);
      await refreshAccount();
      await getHistoryExpenses();
      setChangeValue();
      navigationTo("historySavings");
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Error al registrar el gasto";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmGoalWarning = () => {
    setShowGoalWarning(false);
    setPendingExpense(null);
    setGoalWarningData(null);
  };

  const handleCancelGoalWarning = () => {
    setShowGoalWarning(false);
    setPendingExpense(null);
    setGoalWarningData(null);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  return {
    getHistoryExpenses,
    dataFilter,
    control,
    formState,
    handleSubmit,
    onSubmit,
    handleCategoryChange,
    category,
    handlerFilter,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
    showGoalWarning,
    goalWarningData,
    handleConfirmGoalWarning,
    handleCancelGoalWarning,
  };
};

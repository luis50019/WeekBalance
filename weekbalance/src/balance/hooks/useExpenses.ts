import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CreateExpense } from "../types/Request/CreateExpense";
import { useAuthStore } from "../../auth/store";
import { getHistory, register as registerExpense, getWeeklyTotal, updateExpense as updateExpenseApi, getExpenseById } from "../api/expenses.service";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";
import { BalanceContext } from "../../core/context/BalanceProvider";

type Expense = {
  amount: number;
  description: string;
};

type UpdateExpense = {
  amount: number;
  description: string;
  id: string;
  category: string;
};

export const useExpenses = () => {
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit, reset, setValue } = useForm<Expense>({});
  const { account, refreshAccount, refreshWeeklyData } = useAuthStore();
  const { setChangeValue } = useContext(BalanceContext);
  const [category, setCategory] = useState<string>("");
  const [historyExpenses, setHistoryExpenses] = useState<ResponseIncomeDto[]>([]);
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);

  const [pendingExpense, setPendingExpense] = useState<Expense | null>(null);
  const [showGoalWarning, setShowGoalWarning] = useState(false);
  const [goalWarningData, setGoalWarningData] = useState<{
    remainingToGoal: number;
    expenseAmount: number;
  } | null>(null);

  const [selectedExpense, setSelectedExpense] = useState<ResponseIncomeDto | null>(null);

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
      // Silent fail on get expenses history
    }
  };

  const getWeeklyTotalExpenses = async () => {
    try {
      if (!account) return;
      const total = await getWeeklyTotal(account.id);
      setWeeklyTotal(total);
    } catch (error) {
      // Silent fail on get weekly expenses total
    }
  };

  useEffect(() => {
    getHistoryExpenses();
    getWeeklyTotalExpenses();
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
      showError("Selecciona una categoria para el gasto");
      return;
    }

    // Validar que el monto no supere el saldo actual
    if (account && data.amount > account.balance) {
      showError(`Saldo insuficiente. Disponible: $${account.balance.toFixed(2)}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const newExpense: CreateExpense = {
        account_id: account?.id!,
        amount: data.amount,
        description: data.description,
        category: category,
        created_at: new Date().toISOString(),
      };
      await registerExpense(newExpense);
      await refreshAccount();
      await refreshWeeklyData();
      await getHistoryExpenses();
      await getWeeklyTotalExpenses();
      setChangeValue();
      
      navigationTo("historyExpenses");
    } catch (error: unknown) {
      showError("No se pudo registrar el gasto. Intenta nuevamente");
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

  const getExpenseForEdit = async (id: string) => {
    try {
      const expense = await getExpenseById(id);
      if (!expense) {
        showError("No se encontró el gasto solicitado");
        return null;
      }
      setSelectedExpense(expense);
      setCategory(expense.category || "");
      // Usar setValue en lugar de reset para establecer valores individuales
      setValue("amount", expense.amount);
      setValue("description", expense.description || "");
      return expense;
    } catch (error: any) {
      console.error("Error loading expense:", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Error al cargar el gasto";
      showError(errorMsg);
      return null;
    }
  };

  const onUpdate = async (data: UpdateExpense) => {
    if (!selectedExpense) {
      showError("No hay gasto seleccionado para actualizar");
      return;
    }

    if (!account) {
      showError("Error de sesión. Inicia sesión nuevamente");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateExpenseApi({
        id: selectedExpense.id,
        account_id: account.id,
        amount: data.amount,
        category: data.category,
        description: data.description,
      });
      await refreshAccount();
      await refreshWeeklyData();
      await getHistoryExpenses();
      await getWeeklyTotalExpenses();
      setChangeValue();
      setSelectedExpense(null);
      reset({ amount: 0, description: "" });
      navigationTo("historyExpenses");
    } catch (error: unknown) {
      showError("Error al actualizar el gasto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setSelectedExpense(null);
    setCategory("");
    reset({ amount: 0, description: "" });
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
    weeklyTotal,
    getWeeklyTotalExpenses,
    selectedExpense,
    getExpenseForEdit,
    onUpdate,
    cancelEdit,
    reset,
    setValue,
  };
};

import { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CreateExpense } from "../types/Request/CreateExpense";
import { useAuthStore } from "../../auth/store";
import { getHistory, register } from "../api/expenses.service";
import { BalanceContext } from "../../core/context/ContextBalance";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

type Expense = {
  amount: number;
  description: string;
};

export const useExpenses = () => {
  const { setChangeValue, financialSummary } = useContext(BalanceContext);
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { session, profile } = useAuthStore();
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

  const currentBalance = financialSummary?.balance.balance ?? 0;

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
      if (!profile?.account_id || !session?.access_token)
        throw new Error("No has iniciado sesion");
      const response = await getHistory(
        profile?.account_id,
        session?.access_token,
      );
      setDataFilter(response);
      setHistoryExpenses(response);
    } catch (error) {
      // Error silencioso
    }
  };

  useEffect(() => {
    getHistoryExpenses();
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const getWeekDates = useCallback(() => {
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
  }, []);

  const calculateWeeklySavings = useCallback(() => {
    const { weekStart } = getWeekDates();
    const weekStartDate = new Date(weekStart);

    const weeklyIncomes = (financialSummary?.recentIncomes || [])
      .filter((income) => {
        const incomeDate = new Date(income.created_at);
        return incomeDate >= weekStartDate;
      })
      .reduce((sum, inc) => sum + inc.amount, 0);

    const weeklyExpenseTotal = (historyExpenses || [])
      .filter((exp) => new Date(exp.created_at) >= weekStartDate)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const weeklyNet = weeklyIncomes - weeklyExpenseTotal;
    const targetWeeklySavings = 500;
    const remainingToGoal = Math.max(targetWeeklySavings - weeklyNet, 0);

    return {
      weeklyIncomeTotal: weeklyIncomes,
      weeklyExpenseTotal,
      weeklyNet,
      targetWeeklySavings,
      remainingToGoal,
    };
  }, [financialSummary, historyExpenses, getWeekDates]);

  const onSubmit = async (data: Expense) => {
    if (!category) {
      showError("Debes seleccionar una categoría");
      return;
    }

    if (!data.description || data.description.trim() === "") {
      showError("Debes escribir una descripción");
      return;
    }

    if (data.amount > currentBalance) {
      showError(
        `No puedes registrar este gasto. El monto ($${data.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}) excede tu saldo disponible ($${currentBalance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}).`
      );
      return;
    }

    const { remainingToGoal } = calculateWeeklySavings();

    if (data.amount > remainingToGoal && remainingToGoal > 0) {
      setPendingExpense(data);
      setGoalWarningData({
        remainingToGoal,
        expenseAmount: data.amount,
      });
      setShowGoalWarning(true);
      return;
    }

    await executeExpenseSubmission(data);
  };

  const executeExpenseSubmission = async (data: Expense) => {
    try {
      setIsSubmitting(true);
      const newExpense: CreateExpense = {
        account_id: profile?.account_id!,
        amount: data.amount,
        description: data.description,
        category: category,
      };
      if (!session?.access_token) {
        showError("No hay sesión activa");
        return;
      }
      await register(newExpense, session?.access_token);
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
    if (pendingExpense) {
      executeExpenseSubmission(pendingExpense);
    }
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
    currentBalance,
    showGoalWarning,
    goalWarningData,
    handleConfirmGoalWarning,
    handleCancelGoalWarning,
  };
};

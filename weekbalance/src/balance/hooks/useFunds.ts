import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../auth/store";
import { getHistory, register, getWeeklyTotal, updateIncome, getIncomeById } from "../api/funds.service";
import { CreateFunds } from "../types/Request/CreateFunds";
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

export const useFunds = () => {
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit, reset } = useForm<Expense>({});
  const { account, refreshAccount, refreshWeeklyData } = useAuthStore();
  const { setChangeValue } = useContext(BalanceContext);
  const [category, setCategory] = useState<string>("");
  const [history, setHistory] = useState<ResponseIncomeDto[]>([]);
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [selectedIncome, setSelectedIncome] = useState<ResponseIncomeDto | null>(null);

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
      if (!account) return;
      const response = await getHistory(account.id);
      setDataFilter(response);
      setHistory(response);
    } catch (error) {
      // Silent fail on get history
    }
  };

  const getWeeklyTotalIncome = async () => {
    try {
      if (!account) return;
      const total = await getWeeklyTotal(account.id);
      setWeeklyTotal(total);
    } catch (error) {
      // Silent fail on get weekly total
    }
  };

  useEffect(() => {
    getHistoryFunds();
    getWeeklyTotalIncome();
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

    if (!account) {
      showError("Error de sesión. Inicia sesión nuevamente");
      return;
    }

    try {
      setIsSubmitting(true);
      const newFunds: CreateFunds = {
        account_id: account?.id!,
        category: category,
        source: data.amount,
        description: data.description,
        amount: data.amount.toString(),
      };
      await register(newFunds);
      await refreshAccount();
      await refreshWeeklyData();
      await getHistoryFunds();
      await getWeeklyTotalIncome();
      setChangeValue();
      navigationTo("historyIncomes");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Los datos del ingreso no son válidos. Verifica los campos e intenta nuevamente";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const editIncome = (income: ResponseIncomeDto) => {
    setSelectedIncome(income);
    setCategory(income.category);
    reset({
      amount: income.amount,
      description: income.description || "",
    });
  };

  const onUpdate = async (data: UpdateExpense) => {
    if (!selectedIncome) {
      showError("No hay ingreso seleccionado para actualizar");
      return;
    }

    if (!account) {
      showError("Error de sesión. Inicia sesión nuevamente");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateIncome({
        id: selectedIncome.id,
        account_id: account.id,
        amount: data.amount,
        category: data.category,
        description: data.description,
      });
      await refreshAccount();
      await refreshWeeklyData();
      await getHistoryFunds();
      await getWeeklyTotalIncome();
      setChangeValue();
      setSelectedIncome(null);
      reset({ amount: 0, description: "" });
      navigationTo("historyIncomes");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al actualizar el ingreso";
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setSelectedIncome(null);
    setCategory("");
    reset({ amount: 0, description: "" });
  };

  const getIncomeForEdit = async (id: string) => {
    try {
      const income = await getIncomeById(id);
      setSelectedIncome(income);
      setCategory(income.category);
      reset({
        amount: income.amount,
        description: income.description || "",
      });
      return income;
    } catch (error) {
      showError("Error al cargar el ingreso");
      return null;
    }
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
    weeklyTotal,
    getWeeklyTotalIncome,
    selectedIncome,
    editIncome,
    onUpdate,
    cancelEdit,
    getIncomeForEdit,
  };
};
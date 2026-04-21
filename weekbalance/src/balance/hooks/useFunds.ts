import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../auth/store";
import { getHistory, register, getWeeklyTotal } from "../api/funds.service";
import { CreateFunds } from "../types/Request/CreateFunds";
import { useNavigate } from "../../shared/hooks/useNavigate";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";
import { BalanceContext } from "../../core/context/BalanceProvider";

type Expense = {
  amount: number;
  description: string;
};

export const useFunds = () => {
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { account, refreshAccount } = useAuthStore();
  const { setChangeValue } = useContext(BalanceContext);
  const [category, setCategory] = useState<string>("");
  const [history, setHistory] = useState<ResponseIncomeDto[]>([]);
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);

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
      console.log(error);
    }
  };

  const getWeeklyTotalIncome = async () => {
    try {
      if (!account) return;
      const total = await getWeeklyTotal(account.id);
      setWeeklyTotal(total);
    } catch (error) {
      console.log(error);
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
  };
};

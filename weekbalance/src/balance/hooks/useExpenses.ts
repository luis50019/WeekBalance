import { useContext, useEffect, useState } from "react";
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
  const { setChangeValue } = useContext(BalanceContext);
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { session, profile } = useAuthStore();
  const [category, setCategory] = useState<string>("");
  const [historyExpenses, setHistoryExpenses] = useState<ResponseIncomeDto[]>(
    [],
  );
  const [dataFilter, setDataFilter] = useState<ResponseIncomeDto[]>([]);

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
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoryExpenses();
  }, []);

  const onSubmit = async (data: Expense) => {
    try {
      console.log("account_id", profile?.account_id);
      const newExpense: CreateExpense = {
        account_id: profile?.account_id!,
        amount: data.amount,
        description: data.description,
        category: category,
      };
      if (!session?.access_token) {
        throw new Error("No hay session activa");
      }
      const expenseData = await register(newExpense, session?.access_token);
      setChangeValue();
      navigationTo("historySavings");
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
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
  };
};

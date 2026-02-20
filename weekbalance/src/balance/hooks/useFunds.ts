import { useContext, useState } from "react";
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

  const getHistoryFunds = async () => {
    try {
      if (!profile?.account_id || !session?.access_token)
        throw new Error("No has iniciado sesion");
      const response = await getHistory(
        profile?.account_id,
        session?.access_token,
      );
      setHistory(response);
    } catch (error) {
      console.log(error); //TODO: arreglar la logica para el control de los errores
    }
  };

  const onSubmit = async (data: Expense) => {
    try {
      console.log("Datos del gasto:", data);
      console.log("Datos del usuario:", profile);
      const newExpense: CreateFunds = {
        account_id: profile?.account_id!,
        category: category,
        source: data.amount,
        description: data.description,
        amount: data.amount.toString(),
      };
      if (!session?.access_token) {
        throw new Error("No hay session activa");
      }
      const expenseData = await register(newExpense, session?.access_token);
      setChangeValue();
      navigationTo("Home");
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    console.log("Categoría seleccionada:", category);
    setCategory(category);
  };

  return {
    control,
    formState,
    handleSubmit,
    onSubmit,
    handleCategoryChange,
    category,
    history,
    getHistoryFunds,
  };
};


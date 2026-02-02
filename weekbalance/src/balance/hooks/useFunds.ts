import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../auth/store";
import { register } from "../api/funds.service";
import { CreateFunds } from "../types/Request/CreateFunds";
import { BalanceContext } from "../../core/context/ContextBalance";
import { useNavigate } from "../../shared/hooks/useNavigate";

type Expense = {
  amount: number;
  description: string;
}

export const useFunds = () => {
  const { setChangeValue} = useContext(BalanceContext);
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { user,session,profile } = useAuthStore();
  const [category,setCategory] = useState<string>("");

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
      }
      if(!session?.access_token){
        throw new Error("No hay session activa");
      };
      const expenseData = await register(newExpense,session?.access_token);
      setChangeValue();
      navigationTo("Home");
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  }

  return { control, formState, handleSubmit, onSubmit, handleCategoryChange,category}
}
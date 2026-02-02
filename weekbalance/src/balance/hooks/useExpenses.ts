import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateExpense } from "../types/Request/CreateExpense";
import { useAuthStore } from "../../auth/store";
import { register } from "../api/expenses.service";
import { BalanceContext } from "../../core/context/ContextBalance";
import { useNavigate } from "../../shared/hooks/useNavigate";

type Expense = {
  amount: number;
  description: string;
}

export const useExpenses = () => {
  const { setChangeValue} = useContext(BalanceContext);
  const { navigationTo } = useNavigate();
  const { control, formState, handleSubmit } = useForm<Expense>({});
  const { session,profile } = useAuthStore();
  const [category,setCategory] = useState<string>("");

  const onSubmit = async (data: Expense) => {
    try {
      console.log('account_id',profile?.account_id)
      const newExpense: CreateExpense = {
        account_id: profile?.account_id!,
        amount: data.amount,
        description: data.description,
        category: category
      }
      if(!session?.access_token){
        throw new Error("No hay session activa");
      };
      const expenseData = await register(newExpense,session?.access_token);
      setChangeValue();
      navigationTo('Home');
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  }

  return { control, formState, handleSubmit, onSubmit, handleCategoryChange,category}
}
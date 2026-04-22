import { View } from "react-native";
import { useEffect, useState } from "react";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { StyleExpenseScreen } from "./EditExpenseScreen.style";
import { useExpenses } from "../../hooks/useExpenses";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";
import { categoriesExpenses } from "../../../core/constants/Categories";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";

interface RouteParams {
  expenseId: string;
}

interface FormData {
  amount: number;
  description: string;
}

function EditExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { expenseId } = route.params as RouteParams;
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    handleCategoryChange,
    category,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
    selectedExpense,
    onUpdate,
    cancelEdit,
    getExpenseForEdit,
  } = useExpenses();

  useEffect(() => {
    if (expenseId) {
      loadExpense();
    }
  }, [expenseId]);

  const loadExpense = async () => {
    setIsLoading(true);
    await getExpenseForEdit(expenseId);
    setIsLoading(false);
  };

  const handleUpdate = async (data: FormData) => {
    if (!selectedExpense) return;

    await onUpdate({
      amount: data.amount,
      description: data.description,
      id: selectedExpense.id,
      category: category,
    });
  };

  const handleCancel = () => {
    cancelEdit();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={StyleExpenseScreen.container}>
        <LoadingOverlay visible={true} />
      </View>
    );
  }

  return (
    <View style={StyleExpenseScreen.container}>
      <InputAmount control={control} name="amount" />
      <Categories
        listCategories={categoriesExpenses}
        category={category}
        handleCategoryChange={handleCategoryChange}
      />
      <InputNote
        control={control}
        name="description"
        titleInput="Añadir nota"
      />
      <CustomButton
        handleClick={handleSubmit(handleUpdate)}
        title="Actualizar Gasto"
        iconName="checkmark-outline"
        backgroundColor="#10B981"
      />
      <CustomButton
        handleClick={handleCancel}
        title="Cancelar"
        iconName="close-outline"
        variant="secondary"
        color="#666"
      />
      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={closeErrorModal}
      />
      <LoadingOverlay visible={isSubmitting} />
    </View>
  );
}

export default EditExpenseScreen;

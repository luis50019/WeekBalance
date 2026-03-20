import { View, Text } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { StyleExpenseScreen } from "./NewExpenseScreen.style";
import { useExpenses } from "../../hooks/useExpenses";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import { categoriesExpenses } from "../../../core/constants/Categories";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";
import { ConfirmModal } from "../../../shared/components/UI/ConfirmModal";

function NewExpenseScreen() {
  const {
    control,
    onSubmit,
    handleSubmit,
    handleCategoryChange,
    category,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
    showGoalWarning,
    goalWarningData,
    handleConfirmGoalWarning,
    handleCancelGoalWarning,
  } = useExpenses();

  const warningMessage = goalWarningData
    ? `Este gasto de $${goalWarningData.expenseAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} excede lo que te falta para tu meta semanal ($${goalWarningData.remainingToGoal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}). La meta semanal no se completará.`
    : "";

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
        handleClick={handleSubmit(onSubmit)}
        title="Nuevo Gasto"
        iconName="checkmark-outline"
      />
      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={closeErrorModal}
      />
      <LoadingOverlay visible={isSubmitting} />
      <ConfirmModal
        visible={showGoalWarning}
        title="Meta en riesgo"
        message={warningMessage}
        confirmText="Registrar igual"
        cancelText="Cancelar"
        onConfirm={handleConfirmGoalWarning}
        onCancel={handleCancelGoalWarning}
        icon="alert-circle"
        iconColor="#F59E0B"
      />
    </View>
  );
}

export default NewExpenseScreen;

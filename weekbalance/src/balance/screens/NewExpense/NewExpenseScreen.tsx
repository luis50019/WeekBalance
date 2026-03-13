import { View } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { StyleExpenseScreen } from "./NewExpenseScreen.style";
import { useExpenses } from "../../hooks/useExpenses";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import { categoriesExpenses } from "../../../core/constants/Categories";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";

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
  } = useExpenses();

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
    </View>
  );
}

export default NewExpenseScreen;

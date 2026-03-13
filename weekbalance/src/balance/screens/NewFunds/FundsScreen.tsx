import { View } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { useFunds } from "../../hooks/useFunds";
import { styleFundsScreen } from "./FundsScreen.style";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";
import { categoriesIncomes } from "../../../core/constants/Categories";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";

function FundsScreen() {
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
  } = useFunds();

  return (
    <View style={styleFundsScreen.container}>
      <InputAmount control={control} name="amount" />
      <Categories
        listCategories={categoriesIncomes}
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
        title="Nuevo Ingreso"
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

export default FundsScreen;

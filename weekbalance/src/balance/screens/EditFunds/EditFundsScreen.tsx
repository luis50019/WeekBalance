import { View } from "react-native";
import { useEffect } from "react";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { useFunds } from "../../hooks/useFunds";
import { styleFundsScreen } from "./EditFundsScreen.style";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";
import { categoriesIncomes } from "../../../core/constants/Categories";
import ErrorModal from "../../../shared/components/UI/ErrorModal/ErrorModal";
import LoadingOverlay from "../../../shared/components/UI/LoadingOverlay/LoadingOverlay";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";

interface RouteParams {
  incomeId: string;
}

interface FormData {
  amount: number;
  description: string;
}

function EditFundsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { incomeId } = route.params as RouteParams;

  const {
    control,
    handleSubmit,
    handleCategoryChange,
    category,
    errorMessage,
    showErrorModal,
    closeErrorModal,
    isSubmitting,
    selectedIncome,
    onUpdate,
    cancelEdit,
    getIncomeForEdit,
  } = useFunds();

  const { reset } = useForm<FormData>();

  useEffect(() => {
    if (incomeId) {
      getIncomeForEdit(incomeId);
    }
  }, [incomeId]);

  const handleUpdate = async (data: FormData) => {
    if (!selectedIncome) return;
    
    await onUpdate({
      amount: data.amount,
      description: data.description,
      id: selectedIncome.id,
      category: category,
    });
  };

  const handleCancel = () => {
    cancelEdit();
    navigation.goBack();
  };

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
        handleClick={handleSubmit(handleUpdate)}
        title="Actualizar Ingreso"
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

export default EditFundsScreen;
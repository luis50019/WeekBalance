import { View } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { useFunds } from "../../hooks/useFunds";
import { styleFundsScreen } from "./FundsScreen.style";
import Categories from "../../../shared/components/layout/categories/Categories";
import InputNote from "../../../shared/components/form/formInputNote/InputNote";
import InputAmount from "../../../shared/components/form/FormInputAmount/InputAmount";

function FundsScreen() {
  const { control, onSubmit, handleSubmit, handleCategoryChange, category } =
    useFunds();

  return (
    <View style={styleFundsScreen.container}>
      <InputAmount control={control} name="amount" />
      <Categories
        category={category}
        handleCategoryChange={handleCategoryChange}
      />
      <InputNote control={control} name="note" titleInput="Añadir nota" />
      <CustomButton
        handleClick={handleSubmit(onSubmit)}
        title="Registrar Ingreso"
        iconName="checkmark-outline"
      />
    </View>
  );
}

export default FundsScreen;


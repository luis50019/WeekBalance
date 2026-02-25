import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { styleInputAmount } from "./InputAmoun.style";
import { COLORS } from "../../../../core/constants/Color";
import { amountValidations } from "../formInputNote/inputsValidatios";
interface InputAmountProps {
  control: Control<any>;
  name: string;
}

function InputAmount({ control, name }: InputAmountProps) {
  return (
    <View style={styleInputAmount.conatinerInput}>
      <Text style={styleInputAmount.titlePage}>INGRESAR MONTO</Text>
      <Controller
        control={control}
        name={name}
        rules={amountValidations}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styleInputAmount.inputNumeric}>
            <TextInput
              placeholder={"$ 00.0"}
              placeholderTextColor={COLORS.textPrimary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              style={styleInputAmount.input}
            />
            {error && <Text>{error.message}</Text>}
          </View>
        )}
      />
    </View>
  );
}

export default InputAmount;


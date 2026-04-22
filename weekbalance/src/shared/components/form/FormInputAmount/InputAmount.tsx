import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { styleInputAmount } from "./InputAmoun.style";
import { COLORS } from "../../../../core/constants/Color";
import { amountValidations } from "../formInputNote/inputsValidatios";
import { sanitizeNumericInput } from "../../../utils/validation";
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
            <View style={styleInputAmount.inputContainer}>
              <Text style={styleInputAmount.prefix}>$</Text>
            <TextInput
              placeholder={"00.0"}
              placeholderTextColor={COLORS.textPrimary}
              onBlur={onBlur}
              onChangeText={(text) => onChange(sanitizeNumericInput(text))}
              value={value}
              keyboardType="decimal-pad"
              contextMenuHidden={true}
              style={[styleInputAmount.input, { paddingLeft: 4 }]}
            />
            </View>
            {error && (
              <Text style={styleInputAmount.error}>{error.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

export default InputAmount;

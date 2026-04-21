import React from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import { styleFormInput } from "./FormInput.style";
import { InputProps } from "../../../types/InputProps";
import { sanitizeNumericInput } from "../../../utils/validation";

const isNumericKeyboard = (type: string) =>
  type === "numeric" || type === "decimal-pad" || type === "phone-pad";

export default function FormInput({
  control,
  name,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  rules,
  label,
}: InputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styleFormInput.container}>
          <Text style={styleFormInput.labelInput}>{label}</Text>
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={(text) =>
              isNumericKeyboard(keyboardType)
                ? onChange(sanitizeNumericInput(text))
                : onChange(text)
            }
            value={value}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            placeholderTextColor={"#656b85"}
            style={[styleFormInput.input, error && styleFormInput.errorInput]}
          />
          <Text style={styleFormInput.errorText}>{error?.message || ""}</Text>
        </View>
      )}
    />
  );
}

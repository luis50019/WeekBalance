import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { styleInputNote } from "./InputNote.style";
import { noteValidations } from "./inputsValidatios";
interface PropsInputNote {
  control: Control<any>;
  name: string;
  rules?: object;
  titleInput?: string;
}

function InputNote({ control, name, rules, titleInput }: PropsInputNote) {
  return (
    <View style={styleInputNote.containerInputNote}>
      <Text style={styleInputNote.titleNote}>{titleInput}</Text>
      <Controller
        control={control}
        name={name}
        rules={noteValidations}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              placeholder={"Añadir nota"}
              placeholderTextColor={"#656b85"}
              style={styleInputNote.inputNote}
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="default"
            />
            {error && <Text style={styleInputNote.error}>{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}

export default InputNote;

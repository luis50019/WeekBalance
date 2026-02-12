import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { styleInputNote } from "./InputNote.style";
import { COLORS } from "../../../../core/constants/Color";
import { SafeAreaView } from "react-native-safe-area-context";
interface PropsInputNote {
  control: Control<any>;
  name: string;
  rules?: object;
  titleInput?: string;
}

function InputNote({ control, name, rules, titleInput }: PropsInputNote) {
  return (<View style={styleInputNote.containerInputNote}>
    <Text style={styleInputNote.titleNote}>{titleInput}</Text>
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <TextInput
            placeholder={'Añadir nota'}
            placeholderTextColor={'#656b85'}
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
          {error && <Text>{error.message}</Text>}
        </>
      )}
    />
  </View>);
}

export default InputNote;
import { Pressable, Text, TextInput, View } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { StyleExpenseScreen } from "../NewExpense/ExpenseScreen.style";
import {Ionicons} from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { useFunds } from "../../hooks/useFunds";

function FundsScreen() {
  const { control, onSubmit, handleSubmit,handleCategoryChange,category } = useFunds();
  

  return (<View style={StyleExpenseScreen.container}>
    <Text style={StyleExpenseScreen.titlePage}>AGREGAR FONDOS</Text>
    <View>
      <Text>MONTO A REGISTRAR</Text>
      <Controller
            control={control}
            name={"amount"}
            rules={{required: true}}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View >
                <TextInput
                  placeholder={'$ 00.0'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
                {error && <Text>{error.message}</Text>}
              </View>
            )}
          />
    </View>

    <View style={StyleExpenseScreen.containerCategory}>
      <Text>Origen de los fondos</Text>
      <View style={StyleExpenseScreen.categories}>
        <Pressable onPress={()=>handleCategoryChange("briefcase")}>
          <Ionicons name="briefcase" size={24} color={category === "briefcase" ? "blue" : "black"} />
        </Pressable>
        <Pressable onPress={()=>handleCategoryChange("gift")}>
          <Ionicons name="gift" size={24} color={category === "gift" ? "blue" : "black"} />
        </Pressable>
        <Pressable onPress={()=>handleCategoryChange("refresh")}>
          <Ionicons name="refresh" size={24} color={category === "refresh" ? "blue" : "black"} />
        </Pressable>
        <Pressable onPress={()=>handleCategoryChange("other")}>
          <Ionicons name="ellipsis-horizontal" size={24} color={category === "other" ? "blue" : "black"} />
        </Pressable>
      </View>
    </View>
    <View>
      <Text>DESCRIPCIÓN</Text>
      <Controller
            control={control}
            name={"description"}
            rules={{required: true}}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View >
                <TextInput
                  placeholder={'Descripción del gasto'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="default"
                />
                {error && <Text>{error.message}</Text>}
              </View>
            )}
          />
    </View>
    <CustomButton handleClick={handleSubmit(onSubmit)} title="Guardar gasto" iconName="checkmark-outline" />
    
  </View>);
}

export default FundsScreen;
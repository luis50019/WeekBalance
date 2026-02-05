import { Pressable, Text, TextInput, View } from "react-native";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import {Ionicons} from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { useFunds } from "../../hooks/useFunds";
import { styleFundsScreen } from "./FundsScreen.style";
import { COLORS } from "../../../core/constants/Color";

function FundsScreen() {
  const { control, onSubmit, handleSubmit,handleCategoryChange,category } = useFunds();
  
 //TODO: Todos los componente 
  return (<View style={styleFundsScreen.container}>
    <Text style={styleFundsScreen.titlePage}>AGREGAR FONDOS</Text>
    {/*Este es otro componente es el input principal que debemos  */}
    <View style={styleFundsScreen.conatinerInput}>
      <Controller
            control={control}
            name={"amount"}
            rules={{required: true}}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={styleFundsScreen.inputNumeric} >
                <TextInput
                  placeholder={'$ 00.0'}
                  placeholderTextColor={COLORS.textPrimary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  style={styleFundsScreen.input}
                />
                {error && <Text>{error.message}</Text>}
              </View>
            )}
          />
    </View>
    {/* Este es otro componente reutilizable, 
        debera recibir un array de datos con las categorias y el nombre del icono 
        {
        category: nombre
        icon:nombre} */}
    <View style={styleFundsScreen.containerCategory}>
      <Text style={styleFundsScreen.titleCategories}>Origen</Text>
      <View style={styleFundsScreen.categories}>
        <Pressable style={styleFundsScreen.containerIconCategory} onPress={()=>handleCategoryChange("briefcase")}>
          <Ionicons name="briefcase" size={24} color={category === "briefcase" ? "blue" : "#94A3B8"} />
          <Text>color</Text>
        </Pressable>
        <Pressable style={styleFundsScreen.containerIconCategory} onPress={()=>handleCategoryChange("gift")}>
          <Ionicons name="gift" size={24} color={category === "gift" ? "blue" : "#94A3B8"} />
        </Pressable>
        <Pressable style={styleFundsScreen.containerIconCategory} onPress={()=>handleCategoryChange("refresh")}>
          <Ionicons name="refresh" size={24} color={category === "refresh" ? "blue" : "#94A3B8"} />
        </Pressable>
        <Pressable style={styleFundsScreen.containerIconCategory} onPress={()=>handleCategoryChange("other")}>
          <Ionicons name="ellipsis-horizontal" size={24} color={category === "other" ? "blue" : "#94A3B8"} />
        </Pressable>
      </View>
    </View>
  {/*? Este es un componente reutilzable  */}
    <View>
      <Text>Añadir nota</Text>
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
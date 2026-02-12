import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styleCategory } from "./Category.style";

interface PropsCategory {
  category: string;
  nameIcon: string;
  handleCategoryChange: (category: string) => void;
}

function Category({ category, handleCategoryChange, nameIcon }: PropsCategory) {
  return (
  <View style={styleCategory.conatinerCategory}>
    <Pressable style={category === nameIcon?styleCategory.containerIconCategorySelected:styleCategory.containerIconCategory} onPress={() => handleCategoryChange(nameIcon)}>
      <Ionicons name={nameIcon} size={30} color={category === nameIcon ? '#d75a12c4': '#94A3B8'} />
      <Text style={category === nameIcon?styleCategory.textColorSelected : styleCategory.textColor}>color</Text>
    </Pressable>
  </View>);
}

export default Category;
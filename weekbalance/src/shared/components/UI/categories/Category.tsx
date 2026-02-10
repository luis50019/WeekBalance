import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styleCategory } from "./Category.style";

interface PropsCategory {
  category: string;
  nameIcon: string;
  handleCategoryChange: (category: string) => void;
}

function Category({ category, handleCategoryChange, nameIcon }: PropsCategory) {
  console.log(category);
  return (
  <View style={styleCategory.conatinerCategory}>
    <Pressable style={styleCategory.containerIconCategory} onPress={() => handleCategoryChange(nameIcon)}>
      <Ionicons name={nameIcon} size={24} color={category === nameIcon ? '#ffffff': '#94A3B8'} />
    </Pressable>
    <Text>color</Text>
  </View>);
}

export default Category;
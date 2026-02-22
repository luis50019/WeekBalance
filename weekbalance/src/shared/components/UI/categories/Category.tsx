import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../../../../core/constants/Categories";
import { styleCategory } from "./Category.style";

interface PropsCategory {
  category: string;
  nameIcon: string;
  handleCategoryChange: (category: string) => void;
}

function Category({ category, handleCategoryChange, nameIcon }: PropsCategory) {
  const selected = category === nameIcon;

  return (
    <Pressable
      onPress={() => handleCategoryChange(nameIcon)}
      style={({ pressed }) => [
        styleCategory.card,
        selected && styleCategory.cardActive,
        pressed && styleCategory.pressed,
      ]}
    >
      <Ionicons
        name={nameIcon as any}
        size={28}
        color={selected ? "#F97316" : "#94A3B8"}
      />

      <Text
        style={[styleCategory.label, selected && styleCategory.labelActive]}
      >
        {categories[nameIcon]}
      </Text>
    </Pressable>
  );
}

export default Category;

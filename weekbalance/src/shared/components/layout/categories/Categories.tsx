import { FlatList, Text, View } from "react-native";
import Category from "../../UI/categories/Category";
import { stylesCategoriesGrid } from "./Categories.style";
import { Categories } from "../../../../core/constants/Categories";

interface PropsCategories {
  listCategories: Categories[];
  category: string;
  handleCategoryChange: (category: string) => void;
}

export function CategoriesGrid({
  listCategories,
  category,
  handleCategoryChange,
}: PropsCategories) {
  return (
    <View style={stylesCategoriesGrid.section}>
      <Text style={stylesCategoriesGrid.title}>CATEGORÍAS</Text>

      <FlatList
        data={listCategories}
        numColumns={3}
        keyExtractor={(item) => item.nameIcon}
        columnWrapperStyle={stylesCategoriesGrid.row}
        renderItem={({ index, item }) => {
          return (
            <Category
              key={index}
              category={category}
              handleCategoryChange={handleCategoryChange}
              nameIcon={item.nameIcon}
            />
          );
        }}
      />
    </View>
  );
}

export default CategoriesGrid;

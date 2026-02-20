import { Text, View } from "react-native";
import Category from "../../UI/categories/Category";
import { styleCategories } from "./Categories.style";

interface PropsCategories {
  category: string;
  handleCategoryChange: (category: string) => void;
}

function Categories({ category, handleCategoryChange }: PropsCategories) {
  return (
    <View style={styleCategories.containerCategory}>
      <Text style={styleCategories.titleCategories}>Origen</Text>
      <View style={styleCategories.categories}>
        <Category
          category={category}
          nameIcon="briefcase"
          handleCategoryChange={handleCategoryChange}
        />
        <Category
          category={category}
          nameIcon="gift"
          handleCategoryChange={handleCategoryChange}
        />
        <Category
          category={category}
          nameIcon="refresh"
          handleCategoryChange={handleCategoryChange}
        />
        <Category
          category={category}
          nameIcon="ellipsis-vertical"
          handleCategoryChange={handleCategoryChange}
        />
      </View>
    </View>
  );
}

export default Categories;


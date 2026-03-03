import { FlatList, Pressable, Text, View } from "react-native";
import { styleSlider } from "./Slider.style";
import { optionsCategories } from "../../../../core/constants/Categories";
import { useState } from "react";

interface PropsSlider {
  options: optionsCategories[];
  handlerClick: (category: string) => void;
  title?: string;
}

export const Slider = ({
  title = "opciones",
  options,
  handlerClick,
}: PropsSlider) => {
  const [select, setSelect] = useState<string>("All");
  const handlerOnPress = (category: string) => {
    handlerClick(category);
    setSelect(category);
  };

  return (
    <View style={styleSlider.container}>
      {
        <FlatList
          horizontal
          style={styleSlider.containerList}
          ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
          key={(item, index) => index}
          data={options}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => handlerOnPress(item.nameIcon)}>
              <Text
                style={
                  item.nameIcon == select
                    ? styleSlider.optionSelect
                    : styleSlider.option
                }
              >
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      }
    </View>
  );
};

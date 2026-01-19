import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const Link = ({ to, children, style }: any) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate(to)}>
      <Text style={style}>{children}</Text>
    </Pressable>
  );
};

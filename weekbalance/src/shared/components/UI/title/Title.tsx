import { Text, View } from "react-native";
import { TitleStyle } from "./Title.style";

interface TitleProps {
  message: string;
}

function H1({ message }: TitleProps) {
  return (
  <View style={TitleStyle.container}>
    <Text allowFontScaling={false} style={TitleStyle.message}>{message}</Text>
  </View>);
}


export default H1;
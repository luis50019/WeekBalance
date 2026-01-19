import { Text, View } from "react-native";
import { MessageStyle } from "./Messages.style";

interface Messages {
  message: string;
  textImportant: string;
}

function Messages({ message, textImportant }: Messages) {
  return (
    <View style={MessageStyle.container}>
      <Text allowFontScaling={false} style={MessageStyle.message} >{message}</Text>
      <Text allowFontScaling={false} style={MessageStyle.important} >{textImportant}</Text>
    </View>
  );
}

export default Messages;
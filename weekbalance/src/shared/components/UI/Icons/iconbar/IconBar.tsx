import { Text, View } from "react-native";
import { IconBarStyle } from "./IconBar.style";
interface IIconBar {
  text:string,
  children?:React.ReactNode
}

function IconBar({ text,children }:IIconBar) {
  return (<View style={IconBarStyle.container}>
    {children}
    <Text>{text}</Text>
  </View>);
}

export default IconBar;
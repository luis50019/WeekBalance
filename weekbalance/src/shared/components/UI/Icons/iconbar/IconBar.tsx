import { Pressable, Text, View } from "react-native";
import { IconBarStyle } from "./IconBar.style";
import { useNavigate } from "../../../../hooks/useNavigate";
import { COLORS } from "../../../../../core/constants/Color";
interface IIconBar {
  text:string,
  to:string,
  children?:React.ReactNode
}

function IconBar({ text,children,to }:IIconBar) {
  const { navigationTo } = useNavigate();
  return (
  <Pressable onPress={()=>{navigationTo(to)}}>
    <View style={IconBarStyle.container}>
    {children}
    <Text style={{color:COLORS.textPrimary}} >{text}</Text>
  </View>
  </Pressable>
  );
}

export default IconBar;
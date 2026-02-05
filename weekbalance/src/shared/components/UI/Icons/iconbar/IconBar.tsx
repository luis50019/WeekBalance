import { Pressable, Text, View } from "react-native";
import { IconBarStyle } from "./IconBar.style";
import { useNavigate } from "../../../../hooks/useNavigate";
import { COLORS } from "../../../../../core/constants/Color";
interface IIconBar {
  text:string,
  to:string,
  children?:React.ReactNode,
  click: (value:string)=>void
}

function IconBar({ text,children,to,click }:IIconBar) {
  const { navigationTo } = useNavigate();

  const handlerClick = ()=>{
    navigationTo(to)
    click(text)
  }

  return (
  <Pressable onPress={()=>{handlerClick()}}>
    <View style={IconBarStyle.container}>
    {children}
    <Text style={{color:COLORS.textPrimary}} >{text}</Text>
  </View>
  </Pressable>
  );
}

export default IconBar;
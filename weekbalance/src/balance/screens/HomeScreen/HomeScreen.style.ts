import { StyleSheet } from "react-native";
import { hp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const HomeScreenStyle = StyleSheet.create({
  container:{
    backgroundColor:COLORS.background,
    display:"flex",
    flexDirection:"column",
    justifyContent:'space-between',
    borderColor:"black",
    height:hp(90),
    paddingHorizontal:20,
  },
  body:{
    backgroundColor:'transparent',
    paddingHorizontal:5,
    display:"flex",
    flexDirection:"column",
    gap:20,
  }
})
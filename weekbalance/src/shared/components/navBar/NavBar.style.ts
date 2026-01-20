import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";

export const styleNavBar = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  }
})

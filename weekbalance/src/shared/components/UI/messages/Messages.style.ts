import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const MessageStyle = StyleSheet.create({
  container:{
    display: "flex",
    flexDirection: "row",
    gap: 3,
    
  },
  message:{
    color:COLORS.textSecondary,
    fontSize: 18,
  },
  important:{
    color:COLORS.Headers,
    fontFamily: "arial",
    fontWeight: "bold",
    fontSize: 18,
  }
})
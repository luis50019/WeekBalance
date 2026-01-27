import { StyleSheet } from "react-native";
import { hp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const StyleExpenseScreen = StyleSheet.create({
  container:{
      backgroundColor:COLORS.background,
      display:"flex",
      flexDirection:"column",
      gap:20,
      borderColor:"black",
      minHeight: hp(90),
      maxHeight: hp(90),
      paddingHorizontal:20,
    },
    titlePage:{
      fontSize:24,
      fontWeight:"bold",
      textAlign:"center",
      color:COLORS.Headers,
    },
    containerCategory:{
      display:"flex",
      flexDirection:"column",
      gap:10,
    },
    categories:{
      display:"flex",
      flexDirection:"row",
      gap:10,
    }
});
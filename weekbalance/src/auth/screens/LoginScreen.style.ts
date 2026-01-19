import { StyleSheet } from "react-native";
import { COLORS } from "../../core/constants/Color";
import { hp, wp } from "../../shared/utils/responsive";

export const StyleAuth = StyleSheet.create({
  container: {
    height:"100%",
    backgroundColor:"#fff",
    flexDirection:"column",
    alignItems: "center", 
    justifyContent:"center",
  },
  container_form:{
    width:wp(80),
    height:hp(40),
    gap:20,
    marginTop:hp(5),
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"flex-start"
  },
  container_foot:{
    width:wp(80),
    display:"flex",
    flexDirection:"row",
    gap:10,
  },
  link:{
    color:COLORS.Headers,
    fontWeight:"bold",
  },
  error:{
    color:COLORS.error,
    fontWeight:"500",
    fontSize:15
  }
})
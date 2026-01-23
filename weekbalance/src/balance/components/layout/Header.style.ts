import { StyleSheet } from "react-native";
import { fs, wp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const HeaderStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  info:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    padding:16,
    width:wp(65),
  },
  icon:{
    marginLeft:'auto',

  },
  message:{
    color:COLORS.textSecondary
  },
  full_name:{
    color:COLORS.Headers,
    fontWeight:'bold',
    fontSize:fs(18),
  }
});
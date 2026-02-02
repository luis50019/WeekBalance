import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../utils/responsive";

export const TitleStyle = StyleSheet.create({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height:'auto',
    minWidth: wp(100),
    maxWidth: wp(100),
  },
  message:{
    color:COLORS.textPrimary,
    overflow:'hidden',
    fontSize: hp(5),
    fontWeight:'bold',
  }
});
